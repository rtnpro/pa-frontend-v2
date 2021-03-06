import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AdminRoutingModule } from './admin-routing.module';

import { YatraAdminHolderComponent } from './yatra-admin-holder.component';
import { YatraComponent } from './yatra.component';
import { CreateYatraComponent } from './create-yatra.component';
import { SuperAdminComponent } from './super-admin.component';
import { SuperAdminHolderComponent } from './super-admin-holder.component';
import { YatraListComponent } from './yatra-list.component';
import { CreateProgramComponent } from './create-program.component';
import { ListProgramComponent } from './list-program.component';
import { ManageUserAccountComponent } from './manage-user-account.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        NgbModule,
        FormsModule,
        BrowserModule,
        AdminRoutingModule,
        SharedModule,
    ],
    exports: [],
    declarations: [
        //Super Admin
        SuperAdminHolderComponent,
        SuperAdminComponent,
        CreateYatraComponent,
        YatraListComponent,
        //Yatra Admin
        YatraAdminHolderComponent,
        YatraComponent,
        CreateProgramComponent,
        ListProgramComponent,
        //Login
        ManageUserAccountComponent,
    ],
    providers: [],
})
export class AdminModule { }
