"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var app_routing_module_1 = require("./app-routing.module");
var add_meeting_component_1 = require("./add-meeting/add-meeting.component");
var card_1 = require("@angular/material/card");
var datepicker_1 = require("@angular/material/datepicker");
var input_1 = require("@angular/material/input");
var form_field_1 = require("@angular/material/form-field");
var core_2 = require("@angular/material/core");
var animations_1 = require("@angular/platform-browser/animations");
var select_1 = require("@angular/material/select");
var button_1 = require("@angular/material/button");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var angular_calendar_1 = require("angular-calendar");
var date_fns_1 = require("angular-calendar/date-adapters/date-fns");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                add_meeting_component_1.AddMeetingComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                card_1.MatCardModule,
                datepicker_1.MatDatepickerModule,
                input_1.MatInputModule,
                form_field_1.MatFormFieldModule,
                core_2.MatNativeDateModule,
                animations_1.BrowserAnimationsModule,
                select_1.MatSelectModule,
                button_1.MatButtonModule,
                forms_1.ReactiveFormsModule,
                http_1.HttpClientModule,
                angular_calendar_1.CalendarModule.forRoot({
                    provide: angular_calendar_1.DateAdapter,
                    useFactory: date_fns_1.adapterFactory
                }),
                ng_bootstrap_1.NgbModule,
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;

//# sourceMappingURL=app.module.js.map
