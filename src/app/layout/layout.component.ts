import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, ReplaySubject, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseTailwindService } from '@fuse/services/tailwind/tailwind.service';
import { FUSE_VERSION } from '@fuse/version';
import { Layout } from 'app/layout/layout.types';
import { AppConfig, Scheme, Theme } from 'app/core/config/app.config';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { CommonService } from 'app/shared/services/common.service';
import { FuseNavigationItem, FuseVerticalNavigationAppearance, FuseVerticalNavigationMode, FuseVerticalNavigationPosition } from '@fuse/components/navigation/navigation.types';

@Component({
    selector: 'layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, OnDestroy {
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: [string, any][] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    navigation: any;
    role_id: any;
    public finalPermissions = [];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) private _document: any,
        private _renderer2: Renderer2,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseTailwindConfigService: FuseTailwindService,
        private _navigationMockApi: NavigationMockApi,
        private commonService: CommonService,
    ) {
        /*const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        this.role_id = user.role_id;
        setTimeout(()=>{
            if(this.role_id != undefined){
                this.commonService.getRolePermissions(this.role_id).subscribe(res => {
                    this.finalPermissions.push(res.data.permissions);
                });
            }
            // console.log("this.finalPermissions1",this.finalPermissions);
        },500);*/
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        const user_id = user.id;
        this.commonService.getNotifications(user_id);
        // /this._navigationMockApi.roles.push("test");
        this._navigationMockApi.registerHandlers();
        this._changeDetectorRef.markForCheck();

        // Execute the observable
        // this.onRefreshed.next(true);
        // Get the themes
        this._fuseTailwindConfigService.tailwindConfig$.subscribe((config) => {
            this.themes = Object.entries(config.themes);
        });

        // Set the theme and scheme based on the configuration
        combineLatest([
            this._fuseConfigService.config$,
            this._fuseMediaWatcherService.onMediaQueryChange$(['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)'])
        ]).pipe(
            takeUntil(this._unsubscribeAll),
            map(([config, mql]) => {

                const options = {
                    scheme: config.scheme,
                    theme: config.theme
                };

                // If the scheme is set to 'auto'...
                if (config.scheme === 'auto') {
                    // Decide the scheme using the media query
                    options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
                }

                return options;
            })
        ).subscribe((options) => {

            // Store the options
            this.scheme = options.scheme;
            this.theme = options.theme;

            // Update the scheme and theme
            this._updateScheme();
            this._updateTheme();
        });

        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {

                // Store the config
                this.config = config;

                const retrivedUser = localStorage.getItem('user');
                const user = JSON.parse(retrivedUser) ?? '';
                if (user.theme != "" && user.theme != null && user.scheme != "" && user.scheme != null) {
                    this.config.theme = user.theme;
                    this.config.scheme = user.scheme;
                }
                // Update the layout
                this._updateLayout();
            });

        // Subscribe to NavigationEnd event
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {
            // console.log("navigation end event");
            // Update the layout
            this._updateLayout();
        });

        // Set the app version
        this._renderer2.setAttribute(this._document.querySelector('[ng-version]'), 'fuse-version', FUSE_VERSION);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the layout on the config
     *
     * @param layout
     */
    setLayout(layout: string): void {
        // Clear the 'layout' query param to allow layout changes
        this._router.navigate([], {
            queryParams: {
                layout: null
            },
            queryParamsHandling: 'merge'
        }).then(() => {

            // Set the config
            this._fuseConfigService.config = { layout };
        });
    }

    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void {
        const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        const user_id = user.id;
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("scheme", scheme);
        this.commonService.changeScheme(formData).subscribe(res => {
            this._fuseConfigService.config = res.scheme;
            window.location.reload();
        });
        this._fuseConfigService.config = { scheme };
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void {
        const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        const user_id = user.id;
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("theme", theme);
        this.commonService.changeTheme(formData).subscribe(res => {
            this._fuseConfigService.config = res.theme;
            window.location.reload();
        });
        this._fuseConfigService.config = { theme };

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the selected layout
     */
    private _updateLayout(): void {
        // Get the current activated route
        let route = this._activatedRoute;
        while (route.firstChild) {
            route = route.firstChild;
        }

        // 1. Set the layout from the config
        this.layout = this.config.layout;

        // 2. Get the query parameter from the current route and
        // set the layout and save the layout to the config
        const layoutFromQueryParam = (route.snapshot.queryParamMap.get('layout') as Layout);
        // console.log(layoutFromQueryParam);
        if (layoutFromQueryParam) {
            this.layout = layoutFromQueryParam;
            if (this.config) {
                this.config.layout = layoutFromQueryParam;
            }
        }

        // 3. Iterate through the paths and change the layout as we find
        // a config for it.
        //
        // The reason we do this is that there might be empty grouping
        // paths or componentless routes along the path. Because of that,
        // we cannot just assume that the layout configuration will be
        // in the last path's config or in the first path's config.
        //
        // So, we get all the paths that matched starting from root all
        // the way to the current activated route, walk through them one
        // by one and change the layout as we find the layout config. This
        // way, layout configuration can live anywhere within the path and
        // we won't miss it.
        //
        // Also, this will allow overriding the layout in any time so we
        // can have different layouts for different routes.
        const paths = route.pathFromRoot;
        paths.forEach((path) => {

            // Check if there is a 'layout' data
            if (path.routeConfig && path.routeConfig.data && path.routeConfig.data.layout) {
                // Set the layout
                this.layout = path.routeConfig.data.layout;
            }
        });
    }

    /**
     * Update the selected scheme
     *
     * @private
     */
    private _updateScheme(): void {
        // Remove class names for all schemes
        this._document.body.classList.remove('light', 'dark');
        const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        if (user.scheme != "" && user.scheme != null) {
            this.scheme = user.scheme;
        }
        // Add class name for the currently selected scheme
        this._document.body.classList.add(this.scheme);
    }

    /**
     * Update the selected theme
     *
     * @private
     */
    private _updateTheme(): void {
        // Find the class name for the previously selected theme and remove it
        this._document.body.classList.forEach((className: string) => {
            if (className.startsWith('theme-')) {
                this._document.body.classList.remove(className, className.split('-')[1]);
            }
        });

        const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        if (user.theme != "" && user.theme != null) {
            this.theme = user.theme;
        }
        // Add class name for the currently selected theme
        this._document.body.classList.add(`theme-${this.theme}`);
    }
}
