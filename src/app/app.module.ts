import { TokenInterceptor } from './services/token-interceptor';
import { PostsComponent } from './components/posts/posts.component';
import { UsersComponent } from './components/users/users.component';
// Global imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// local imports
import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { AuthService } from './services/auth.service';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { AuthGuard } from './services/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { NoAccessComponent } from './components/no-access/no-access.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { TreeviewModule } from 'ngx-treeview';
import { EventTreeComponent } from './components/event-tree/event-tree.component';
import { SessionService } from './services/session.service';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostPreviewComponent } from './components/post-preview/post-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    UsersComponent,
    LoginComponent,
    NoAccessComponent,
    NotFoundComponent,
    NavBarComponent,
    DashboardComponent,
    UserFormComponent,
    PostFormComponent,
    EventTreeComponent,
    UserSettingsComponent,
    PostPreviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TreeviewModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: PostsComponent, canActivate: [AuthGuard] },
      { path: 'posts/add', component: PostFormComponent, canActivate: [AuthGuard] },
      { path: 'posts/edit/:id', component: PostFormComponent, canActivate: [AuthGuard] },
      { path: 'users/add', component: UserFormComponent, canActivate: [AuthGuard, AdminAuthGuard] },
      { path: 'users/me', component: UserSettingsComponent, canActivate: [AuthGuard]},
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard, AdminAuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'no-access', component: NoAccessComponent },
    ])
  ],
  providers: [
    UserService,
    PostService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService,
    AdminAuthGuard,
    AuthGuard,
    SessionService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
