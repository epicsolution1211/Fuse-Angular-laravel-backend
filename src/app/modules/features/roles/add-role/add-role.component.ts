import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'add-role',
    templateUrl: './add-role.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddRoleComponent implements OnInit {
    form: FormGroup;
    readPermissions: any = [];
    writePermissions: any = [];
    updatePermissions: any = [];
    deletePermissions: any = [];
    features: any;
    isLoading: boolean;
    submitted: boolean = false;
    roleId: string;
    selectedProduct: any;
    roles: any;
    permissions: any = [];
    isIndeterminate = true;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<AddRoleComponent>,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService,
        private _router: Router,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.roleId = this.data?.roleId;

        this.isLoading = true;
        // setTimeout(() => {
        this.commonService.getFeatures().subscribe(res => {

            // console.log(res);

            this.features = res.data.features;
            this.isLoading = false;
        });
        // },500);

        // Create the form
        this.form = this._formBuilder.group({
            role: ['', [Validators.required]]
        });

        if (this.roleId != null) {
            this.isLoading = true;
            this.commonService.getRoleById(this.roleId).subscribe(res => {
                this.roles = res.data.role;
                this.form = this._formBuilder.group({
                    role: [res.data.role.role, [Validators.required]]
                });
                setTimeout(() => {
                    this.features.map(feature => {
                        const permission = this.roles.permissions.find(p => p.feature_id == feature.id);
                        const role_id = this.roles.id;
                        const shouldDisable = (role_id == 3 && (feature.id == 2 || feature.id == 10)) ? true : false;
                        if (permission != undefined) {
                            const finalPermissions = JSON.parse(permission.permissions);
                            this.permissions.push({
                                'id': feature.id,
                                'feature': (feature.name == 'Licences Management' ? 'Licence Management' : feature.name),
                                'permissions': finalPermissions,
                                'role_id': role_id,
                                'disabled': shouldDisable,
                            });
                        } else {
                            this.permissions.push({
                                'id': feature.id,
                                // 'feature': feature.name,
                                'feature': (feature.name == 'Licences Management' ? 'Licence Management' : feature.name),
                                'permissions': [],
                                'role_id': role_id,
                                'disabled': shouldDisable
                            });
                        }
                    });
                }, 500);

                this.roles.permissions.find(permission => {
                    const read = permission.permissions.includes("read");
                    if (read == true) {
                        this.onReadChange(permission.feature_id, "true");
                    }
                    const write = permission.permissions.includes("write");
                    if (write == true) {
                        this.onWriteChange(permission.feature_id, "true");
                    }
                    const update = permission.permissions.includes("update");
                    if (update == true) {
                        this.onUpdateChange(permission.feature_id, "true");
                    }
                    const delete_permission = permission.permissions.includes("delete");
                    if (delete_permission == true) {
                        this.onDeleteChange(permission.feature_id, "true");
                    }
                });

                this.isLoading = false;
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the copy field with the given field name
     *
     * @param name
     */

    /**
     * Save and close
     */
    saveAndClose(): void {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {

    }

    /**
     * Send the message
     */
    save(): void {
        this.submitted = true;
        if (this.form.valid) {
            this.isLoading = true;
            const formData = new FormData();
            formData.append("roleId", this.roleId);
            formData.append("role", this.form.get("role").value);
            formData.append("readpermissions", JSON.stringify(this.readPermissions));
            formData.append("writepermissions", JSON.stringify(this.writePermissions));
            formData.append("updatepermissions", JSON.stringify(this.updatePermissions));
            formData.append("deletepermissions", JSON.stringify(this.deletePermissions));
            formData.append("permissions", JSON.stringify(this.permissions));

            this.commonService.addRole(formData).subscribe(data => {

                // console.log("this.permissions>>>>>>>>", this.permissions);

                this.isLoading = false;
                this.submitted = false;
                this.toastr.success(data.message, 'Success!', { progressBar: true });
                // set permissions(permissions){
                // localStorage.setItem('permissions', JSON.stringify(this.permissions));
                // }

                this.commonService.getFeatures().subscribe(res => {
                    this.features = res.data.features;
                    const permissions = localStorage.getItem('permissions');

                    // console.log(permissions);

                    const permission_arr = JSON.parse(permissions);

                    // console.log(permission_arr);
                });
                this._router.navigate(['/roles/delete']);
            }, error => {
                this.isLoading = false;
                this.toastr.error(error, 'Error');
            });

            this.matDialogRef.close();
        }
    }

    onReadChange(id, isChecked) {
        // console.log("id", id);
        if (isChecked) {
            this.readPermissions.push(id);
            /*this.writePermissions.push(id);
            this.updatePermissions.push(id);
            this.deletePermissions.push(id);*/
            if (id == 4) {
                const Tidx4 = this.permissions.find(x => x.id == 4);
                if (Tidx4 != null) {
                    Tidx4.permissions.push("read");
                }

                const Tidx11 = this.permissions.find(x => x.id == 11);
                if (Tidx11 != undefined) {
                    Tidx11.permissions.push("read");
                }

                const Didx12 = this.permissions.find(x => x.id == 12);
                if (Didx12 != undefined) {
                    Didx12.permissions.push("read");
                }
            }
            if (id == 11) {
                /*let Tidx4 = this.permissions.find(x => x.id == 4);
                Tidx4.permissions.push("read");*/
                const Tidx11 = this.permissions.find(x => x.id == 11);

                if (Tidx11 != undefined) {
                    Tidx11.permissions.push("read");

                }

                /*let Didx12 = this.permissions.find(x => x.id == 12);
                Didx12.permissions.push("read");*/
            }
            if (id == 12) {
                /*let Tidx4 = this.permissions.find(x => x.id == 4);
                Tidx4.permissions.push("read");
                let Tidx11 = this.permissions.find(x => x.id == 11);
                Tidx11.permissions.push("read");*/
                const Didx12 = this.permissions.find(x => x.id == 12);

                if (Didx12 != undefined) {
                    Didx12.permissions.push("read");

                }
            }
            const permission = this.roles.permissions.find(p => p.feature_id == id);
            for (let i = 0; i < this.permissions.length; i++) {
                if (this.permissions[i].id == id) {
                    this.permissions[i].id = id;
                    this.permissions[i].feature = this.permissions[i].feature;
                    this.permissions[i].permissions = ["read"];
                    this.permissions[i].role_id = this.permissions[i].role_id;
                    this.permissions[i].disabled = false;
                }
            }
        } else {
            const rdxf = this.readPermissions.find(x => x == id);
            const ridx = this.readPermissions.findIndex(x => x == rdxf);
            this.readPermissions.splice(ridx, 1);
            const wdxf = this.readPermissions.find(x => x == id);
            const widx = this.writePermissions.findIndex(x => x == wdxf);
            this.writePermissions.splice(widx, 1);
            const uidx = this.updatePermissions.findIndex(x => x == id);
            this.updatePermissions.splice(uidx, 1);
            const didx = this.deletePermissions.findIndex(x => x == id);
            this.deletePermissions.splice(didx, 1);
            if (id == 4) {
                const Tidx = this.permissions.find(x => x.id == 11);
                const indexx = Tidx.permissions.indexOf("read");
                if (indexx !== -1) {
                    Tidx.permissions.splice(indexx, 1);
                }
                const Didx = this.permissions.find(x => x.id == 12);
                const index = Didx.permissions.indexOf("read");
                if (index !== -1) {
                    Didx.permissions.splice(index, 1);
                }
            }
            if (id == 11) {
                /*let Tidx4 = this.permissions.find(x => x.id == 4);
                var index4 = Tidx4.permissions.indexOf("read");
                if (index4 !== -1) {
                    Tidx4.permissions.splice(index4, 1);
                }*/
                const Tidx = this.permissions.find(x => x.id == 11);
                const index = Tidx.permissions.indexOf("read");
                if (index !== -1) {
                    Tidx.permissions.splice(index, 1);
                }
                /*let Didx = this.permissions.find(x => x.id == 12);
                var index = Didx.permissions.indexOf("read");
                if (index !== -1) {
                    Didx.permissions.splice(index, 1);
                }*/
            }
            if (id == 12) {
                /*let Tidx4 = this.permissions.find(x => x.id == 4);
                var index4 = Tidx4.permissions.indexOf("read");
                if (index4 !== -1) {
                    Tidx4.permissions.splice(index4, 1);
                }
                let Tidx = this.permissions.find(x => x.id == 11);
                var index = Tidx.permissions.indexOf("read");
                if (index !== -1) {
                    Tidx.permissions.splice(index, 1);
                }*/
                const Didx = this.permissions.find(x => x.id == 12);
                const index = Didx.permissions.indexOf("read");
                if (index !== -1) {
                    Didx.permissions.splice(index, 1);
                }
            }
            const permission = this.roles.permissions.find(p => p.feature_id == id);
            for (let i = 0; i < this.permissions.length; i++) {
                if (this.permissions[i].id == id) {
                    this.permissions[i].id = id;
                    this.permissions[i].feature = this.permissions[i].feature;
                    this.permissions[i].permissions = [];
                    this.permissions[i].role_id = this.permissions[i].role_id;
                    this.permissions[i].disabled = false;
                }
            }
        }
    }
    /*onReadChange(id,isChecked){
        if (isChecked) {
            this.readPermissions.push(id);
        }else{
            if(id == 4){
                // console.log("this.readPermissions",this.readPermissions);
                let rdxf11 = this.readPermissions.find(x => x == 11);
                let rdxi11 = this.readPermissions.findIndex(x => x == rdxf11);
                this.readPermissions.splice(rdxi11, 1);
                let rdxf12 = this.readPermissions.find(x => x == 12);
                let rdxi12 = this.readPermissions.findIndex(x => x == rdxf12);
                this.readPermissions.splice(rdxi12, 1);

                this.writePermissions.splice(rdxi11, 1);
                this.updatePermissions.splice(rdxi11, 1);
                this.deletePermissions.splice(rdxi11, 1);

                this.writePermissions.splice(rdxi12, 1);
                this.updatePermissions.splice(rdxi12, 1);
                this.deletePermissions.splice(rdxi12, 1);
            }
            let idx = this.readPermissions.findIndex(x => x == id);
            this.readPermissions.splice(idx, 1);
            this.writePermissions.splice(idx, 1);
            this.updatePermissions.splice(idx, 1);
            this.deletePermissions.splice(idx, 1);
            let permission =  this.roles.permissions.find(p => p.feature_id == id);
            for(let i=0;i<this.permissions.length;i++){
                if(this.permissions[i].id == id){
                    this.permissions[i].id = id;
                    this.permissions[i].feature = this.permissions[i].feature;
                    this.permissions[i].permissions = [];
                    this.permissions[i].role_id = this.permissions[i].role_id;
                    this.permissions[i].disabled = false;
                    this.readPermissions.splice(id, 1);
                    this.writePermissions.splice(id, 1);
                    this.updatePermissions.splice(id, 1);
                    this.deletePermissions.splice(id, 1);
                }
            }
            if(id == 4){
                let permission =  this.roles.permissions.find(p => p.feature_id == id);
                for(let i=0;i<this.permissions.length;i++){
                    if(this.permissions[i].id == id){
                        this.permissions[i].id = id;
                        this.permissions[i].feature = this.permissions[i].feature;
                        this.permissions[i].permissions = [];
                        this.permissions[i].role_id = this.permissions[i].role_id;
                        this.permissions[i].disabled = false;
                        this.readPermissions.splice(id, 1);
                        this.writePermissions.splice(id, 1);
                        this.updatePermissions.splice(id, 1);
                        this.deletePermissions.splice(id, 1);
                    } else if(this.permissions[i].id != 6 && this.permissions[i].id != 8 && this.permissions[i].id != 2 && this.permissions[i].id != 3 && this.permissions[i].id != 13 && this.permissions[i].id != 14 && this.permissions[i].id != 15) {
                        this.permissions[i].id = id;
                        this.permissions[i].feature = this.permissions[i].feature;
                        this.permissions[i].permissions = [];
                        this.permissions[i].role_id = this.permissions[i].role_id;
                        this.permissions[i].disabled = false;
                        this.readPermissions.splice(id, 1);
                        this.writePermissions.splice(id, 1);
                        this.updatePermissions.splice(id, 1);
                        this.deletePermissions.splice(id, 1);
                    }
                }
            }else{
                let permission =  this.roles.permissions.find(p => p.feature_id == id);
                for(let i=0;i<this.permissions.length;i++){
                    if(this.permissions[i].id == id){
                        this.permissions[i].id = id;
                        this.permissions[i].feature = this.permissions[i].feature;
                        this.permissions[i].permissions = [];
                        this.permissions[i].role_id = this.permissions[i].role_id;
                        this.permissions[i].disabled = false;
                        this.readPermissions.splice(id, 1);
                        this.writePermissions.splice(id, 1);
                        this.updatePermissions.splice(id, 1);
                        this.deletePermissions.splice(id, 1);
                    }
                }
            }
        }
    }*/

    onWriteChange(id, isChecked) {
        if (isChecked) {
            this.writePermissions.push(id);
            const widx = this.permissions.find(x => x.id == id);
            if (widx != undefined) {
                widx.permissions.push("write");
            }
            // widx.permissions.push("write");
        } else {
            const idx = this.writePermissions.findIndex(x => x == id);
            this.writePermissions.splice(idx, 1);
            const widx = this.permissions.find(x => x.id == id);
            const index = widx.permissions.indexOf("write");
            if (index !== -1) {
                widx.permissions.splice(index, 1);
            }
        }

        // console.log("write permissions",);

    }

    onUpdateChange(id, isChecked) {

        // console.log("update permissions", id, isChecked);

        if (isChecked) {
            this.updatePermissions.push(id);
            const widx = this.permissions?.find(x => x.id == id);

            if (widx != undefined) {
                widx.permissions.push("update");
                widx.permissions.push("update");
            }

        } else {
            const idx = this.updatePermissions.findIndex(x => x == id);
            this.updatePermissions.splice(idx, 1);
            const uidx = this.permissions.find(x => x.id == id);
            const index = uidx.permissions.indexOf("update");
            if (index !== -1) {
                uidx.permissions.splice(index, 1);
            }
        }
    }

    onDeleteChange(id, isChecked) {
        if (isChecked) {
            this.deletePermissions.push(id);
            const didx = this.permissions.find(x => x.id == id);

            if (didx != undefined) {
                didx.permissions.push("delete");
                didx.permissions.push("delete", "read");
            }

        } else {
            const idx = this.deletePermissions.findIndex(x => x == id);
            this.deletePermissions.splice(idx, 1);
            const uidx = this.permissions.find(x => x.id == id);
            const index = uidx.permissions.indexOf("delete");
            if (index !== -1) {
                uidx.permissions.splice(index, 1);
            }
        }
    }

    /*makeJSON(event,write){
        // console.log("event",event);
        // console.log("write",write);
        // console.log("this.roles.permissions",this.roles.permissions);
        let feature_ids = this.roles.permissions.findIndex(x => x.feature_id == write);
        for(let i=0;i<this.roles.permissions.length;i++){
            if(i == feature_ids){
                this.roles.permissions[i]['permissions'] = "[]";
                this.features.map(feature => {
                    var permission =  this.roles.permissions.find(p => p.feature_id == feature.id);
                    const role_id = this.roles.id;
                    const shouldDisable = (role_id == 3 && (feature.id == 2 || feature.id == 10)) ? true : false;
                    if(permission != undefined){
                        var finalPermissions = JSON.parse(permission.permissions);
                        this.permissions.push({
                            'id':feature.id,
                            'feature': feature.name,
                            'permissions': finalPermissions,
                            'role_id': role_id,
                            'disabled': shouldDisable,
                        });
                    }else{
                        this.permissions.push({
                            'id':feature.id,
                            'feature': feature.name,
                            'permissions': [],
                            'role_id': role_id,
                            'disabled': shouldDisable
                        });
                    }
                });
            }
        }
    }*/
}
