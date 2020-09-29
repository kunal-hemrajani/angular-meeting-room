"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var AddMeetingComponent = /** @class */ (function () {
    function AddMeetingComponent(http) {
        this.http = http;
        this.allRooms = [{ id: 1, name: 'Room 1', status: 'Available' }, { id: 2, name: 'Room 2', status: 'Available' }, { id: 3, name: 'Room 3', status: 'Available' }, { id: 4, name: 'Room 4', status: 'Available' }, { id: 5, name: 'Room 5', status: 'Available' }, { id: 6, name: 'Room 6', status: 'Available' }, { id: 7, name: 'Room 7', status: 'Available' }, { id: 8, name: 'Room 8', status: 'Available' }, { id: 9, name: 'Room 9', status: 'Available' }, { id: 10, name: 'Room 10', status: 'Available' },];
    }
    AddMeetingComponent.prototype.ngOnInit = function () {
        this.getStatus();
    };
    AddMeetingComponent.prototype.getStatus = function () {
        var _this = this;
        var _loop_1 = function (x) {
            this_1.http.post('http://localhost:8080/get_rooms', { id: this_1.allRooms[x].id }).subscribe(function (res) {
                if (res['response'][0]) {
                    if (_this.allRooms[x].id == res['response'][0].room_id) {
                        _this.allRooms[x]['meetings'] = res['response'];
                        _this.allRooms[x]['meetings'].forEach(function (ele) {
                            var currentDate = new Date();
                            var sTime = ele.start_time;
                            var t1 = sTime.split(' ');
                            var t2 = t1[0].split(':');
                            t2[0] = (t1[1] === 'PM' ? (1 * t2[0] + 12) : t2[0]);
                            var time24 = (t2[0] < 10 ? '0' + t2[0] : t2[0]) + ':' + t2[1];
                            var eTime = ele.end_time;
                            var et1 = eTime.split(' ');
                            var et2 = et1[0].split(':');
                            et2[0] = (et1[1] === 'PM' ? (1 * et2[0] + 12) : et2[0]);
                            var etime24 = (et2[0] < 10 ? '0' + et2[0] : et2[0]) + ':' + et2[1];
                            var xy = new Date(currentDate);
                            var cTime = xy.getHours() + ':' + xy.getMinutes();
                            console.log(ele);
                            if (time24 <= cTime && etime24 >= cTime) {
                                _this.allRooms[x].status = 'Booked by ' + ele.name + ' - Duration :' + time24 + ' - ' + etime24;
                            }
                            else {
                                _this.allRooms[x].status = 'Available';
                            }
                        });
                    }
                }
            });
        };
        var this_1 = this;
        for (var x = 0; x < this.allRooms.length; x++) {
            _loop_1(x);
        }
    };
    AddMeetingComponent.prototype.getRandomColor = function () {
        var color = Math.floor(0x1000000 * Math.random()).toString(16);
        return '#' + ('000000' + color).slice(-6);
    };
    AddMeetingComponent = __decorate([
        core_1.Component({
            selector: 'app-add-meeting',
            templateUrl: './add-meeting.component.html',
            styleUrls: ['./add-meeting.component.css']
        })
    ], AddMeetingComponent);
    return AddMeetingComponent;
}());
exports.AddMeetingComponent = AddMeetingComponent;

//# sourceMappingURL=add-meeting.component.js.map
