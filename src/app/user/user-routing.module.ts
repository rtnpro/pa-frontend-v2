import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicAuthGuardService } from '../login/basic-auth-gaurd.service';
import { routeConstants } from '../shared/app-properties';

import { ChangePasswordComponent } from './change-password.component';
import { UserComponent } from './user.component';

const routes: Routes = [
    {
        path: routeConstants.user,
        component: UserComponent,
        canActivate: [BasicAuthGuardService],
        children: [
            {
                path: routeConstants.changePassword,
                component: ChangePasswordComponent,
                canActivate: [BasicAuthGuardService],
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule { }