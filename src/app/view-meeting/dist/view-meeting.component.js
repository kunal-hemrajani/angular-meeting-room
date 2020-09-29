"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var angular_calendar_1 = require("angular-calendar");
var date_fns_1 = require("date-fns");
var rxjs_1 = require("rxjs");
var colors = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};
var ViewMeetingComponent = /** @class */ (function () {
    function ViewMeetingComponent(http, modal, route) {
        var _this = this;
        this.http = http;
        this.modal = modal;
        this.route = route;
        this.view = angular_calendar_1.CalendarView.Week;
        this.CalendarView = angular_calendar_1.CalendarView;
        this.viewDate = new Date();
        this.actions = [
            {
                label: '<i class="fas fa-fw fa-pencil-alt"></i>',
                a11yLabel: 'Edit',
                onClick: function (_a) {
                    var event = _a.event;
                    _this.handleEvent('Edited', event);
                }
            },
            {
                label: 'Delete',
                a11yLabel: 'Delete',
                onClick: function (_a) {
                    var event = _a.event;
                    _this.events = _this.events.filter(function (iEvent) { return iEvent !== event; });
                    _this.handleEvent('Deleted', event);
                }
            },
        ];
        this.events = [];
        this.activeDayIsOpen = true;
        this.refresh = new rxjs_1.Subject();
        this.allMeeting = [];
        this.minDate = new Date();
        this.meetingForm = new forms_1.FormGroup({
            agenda: new forms_1.FormControl(),
            date: new forms_1.FormControl(new Date()),
            start_time: new forms_1.FormControl(),
            end_time: new forms_1.FormControl(),
            room_id: new forms_1.FormControl(),
            name: new forms_1.FormControl()
        });
        this.dayStartHour = 9;
        this.dayEndHour = 18;
        this.weekStartsOn = 1;
        this.myDateFilter = function (d) {
            var day = (d || new Date()).getDay();
            return day !== 0 && day !== 6;
        };
    }
    ViewMeetingComponent.prototype.ngOnInit = function () {
        this.roomNo = this.route.params['_value']['roomId'];
        this.getRooms(this.roomNo);
        this.meetingForm = new forms_1.FormGroup({
            agenda: new forms_1.FormControl(),
            date: new forms_1.FormControl(new Date()),
            start_time: new forms_1.FormControl(),
            end_time: new forms_1.FormControl(),
            room_id: new forms_1.FormControl(this.roomNo),
            name: new forms_1.FormControl()
        });
    };
    ViewMeetingComponent.prototype.getRooms = function (roomId) {
        var _this = this;
        this.http.post('http://localhost:8080/check_availability', { room_id: roomId }).subscribe(function (res) {
            _this.allMeeting = res['response'];
            _this.events = [];
            _this.allMeeting.forEach(function (res) {
                // get start time 
                var sTime = res.start_time;
                var t1 = sTime.split(' ');
                var t2 = t1[0].split(':');
                t2[0] = (t1[1] === 'PM' ? (1 * t2[0] + 12) : t2[0]);
                var time24 = (t2[0] < 10 ? '0' + t2[0] : t2[0]) + ':' + t2[1];
                var snewdate = moment(res.date * 1000).toDate().toString();
                var completeSDate = snewdate.replace("00:00", time24.toString());
                // get end time 
                var eTime = res.end_time;
                var et1 = eTime.split(' ');
                var et2 = et1[0].split(':');
                et2[0] = (et1[1] === 'PM' ? (1 * et2[0] + 12) : et2[0]);
                var etime24 = (et2[0] < 10 ? '0' + et2[0] : et2[0]) + ':' + et2[1];
                var senewdate = moment(res.date * 1000).toDate().toString();
                var completeEDate = senewdate.replace("00:00", etime24.toString());
                console.log(moment(completeSDate).format(), moment(completeEDate).format());
                _this.events.push({
                    start: date_fns_1.addHours(date_fns_1.startOfDay(moment(completeSDate).toDate()), 0),
                    end: date_fns_1.addHours(moment(completeEDate).toDate(), 0),
                    title: res.agenda,
                    allDay: false,
                    color: colors.red,
                    actions: _this.actions,
                    id: res.id
                });
            });
        });
    };
    ViewMeetingComponent.prototype.dayClicked = function (_a) {
        var date = _a.date, events = _a.events;
        if (date_fns_1.isSameMonth(date, this.viewDate)) {
            if ((date_fns_1.isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0) {
                this.activeDayIsOpen = false;
            }
            else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    };
    ViewMeetingComponent.prototype.eventTimesChanged = function (_a) {
        var event = _a.event, newStart = _a.newStart, newEnd = _a.newEnd;
        this.events = this.events.map(function (iEvent) {
            if (iEvent === event) {
                return __assign(__assign({}, event), { start: newStart, end: newEnd });
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    };
    ViewMeetingComponent.prototype.handleEvent = function (action, event) {
        this.modalData = { event: event, action: action };
        console.log(event, action);
        // this.modal.open(this.modalContent, {size: 'lg'});
        if (action == 'Deleted') {
            this.http.post('http://localhost:8080/delete_meeting', { id: event.id }).subscribe(function (res) {
            });
        }
    };
    ViewMeetingComponent.prototype.addEvent = function () {
        this.events = __spreadArrays(this.events, [
            {
                title: 'New event',
                start: date_fns_1.startOfDay(new Date()),
                end: date_fns_1.endOfDay(new Date()),
                color: colors.red,
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true
                }
            }
        ]);
    };
    ViewMeetingComponent.prototype.deleteEvent = function (eventToDelete) {
        debugger;
        this.events = this.events.filter(function (event) { return event !== eventToDelete; });
        console.log(this.events);
    };
    ViewMeetingComponent.prototype.setView = function (view) {
        this.view = view;
    };
    ViewMeetingComponent.prototype.closeOpenMonthViewDay = function () {
        this.activeDayIsOpen = false;
    };
    ViewMeetingComponent.prototype.addNewMeeting = function () {
        var _this = this;
        this.meetingForm.value.date = moment(this.meetingForm.value.date).unix();
        this.http.post('http://localhost:8080/insert_meeting', this.meetingForm.value).subscribe(function (res) {
            _this.meetingForm = new forms_1.FormGroup({
                agenda: new forms_1.FormControl(),
                date: new forms_1.FormControl(),
                start_time: new forms_1.FormControl(),
                end_time: new forms_1.FormControl(),
                room_id: new forms_1.FormControl(),
                name: new forms_1.FormControl()
            });
            _this.getRooms(_this.roomNo);
        });
    };
    __decorate([
        core_1.ViewChild('modalContent', { static: true })
    ], ViewMeetingComponent.prototype, "modalContent");
    __decorate([
        core_1.Input()
    ], ViewMeetingComponent.prototype, "dayStartHour");
    __decorate([
        core_1.Input()
    ], ViewMeetingComponent.prototype, "dayEndHour");
    __decorate([
        core_1.Input()
    ], ViewMeetingComponent.prototype, "weekStartsOn");
    ViewMeetingComponent = __decorate([
        core_1.Component({
            selector: 'app-view-meeting',
            templateUrl: './view-meeting.component.html',
            styleUrls: ['./view-meeting.component.css']
        })
    ], ViewMeetingComponent);
    return ViewMeetingComponent;
}());
exports.ViewMeetingComponent = ViewMeetingComponent;

//# sourceMappingURL=view-meeting.component.js.map
