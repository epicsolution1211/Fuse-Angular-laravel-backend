import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ExtraOptions, PreloadAllModules, RouterModule } from "@angular/router";
import { MarkdownModule } from "ngx-markdown";
import { FuseModule } from "@fuse";
import { FuseConfigModule } from "@fuse/services/config";
import { FuseMockApiModule } from "@fuse/lib/mock-api";
import { CoreModule } from "app/core/core.module";
import { appConfig } from "app/core/config/app.config";
import { mockApiServices } from "app/mock-api";
import { LayoutModule } from "app/layout/layout.module";
import { AppComponent } from "app/app.component";
import { appRoutes } from "app/app.routing";
import {
  LocationStrategy,
  PathLocationStrategy,
  HashLocationStrategy,
} from "@angular/common";
import { ToastrModule } from "ngx-toastr";
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { MatRadioModule } from "@angular/material/radio";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { MatSelectModule } from "@angular/material/select";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Daterangepicker } from "ng2-daterangepicker";
import { environment } from "../environments/environment";
import { ServiceWorkerModule } from "@angular/service-worker";
import * as firebase from "firebase/app";
import { MessagingService } from "./shared/services/messaging.service";
firebase.default.initializeApp(environment.firebase);
import { PusherService } from "./pusher.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

const routerConfig: ExtraOptions = {
  scrollPositionRestoration: "enabled",
  preloadingStrategy: PreloadAllModules,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    // Fuse, FuseConfig & FuseMockAPI
    FuseModule,
    FuseConfigModule.forRoot(appConfig),
    FuseMockApiModule.forRoot(mockApiServices),

    // Core module of your application
    CoreModule,

    // Layout module of your application
    LayoutModule,
    MatTableModule,
    SocialLoginModule,
    // 3rd party modules that require global configuration via forRoot
    MarkdownModule.forRoot({}),
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
      timeOut: 2000,
      autoDismiss: true,
    }),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxSpinnerModule,
    MatProgressBarModule,
    Daterangepicker,
    NgSelectModule,
    ServiceWorkerModule.register("combined-sw.js", {
      enabled: environment.production,
      registrationStrategy: "registerImmediately",
    }),
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
  ],

  providers: [
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("487658218709595"),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        height: "max-content",
        minHeight: "30rem",
        maxHeight: "90vh",
        width: "1200px",
        maxWidth: "100%",
      },
    },
    MessagingService,
    PusherService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
