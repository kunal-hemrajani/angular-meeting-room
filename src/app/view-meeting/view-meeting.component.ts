import { Component, OnInit,ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: 'Delete',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();
  allMeeting =[];
  roomNo:any;
  minDate = new Date();
  meetingForm = new FormGroup({
    agenda: new FormControl(),
    date: new FormControl(new Date()),
    start_time: new FormControl(),
    end_time: new FormControl(),
    room_id: new FormControl(),
    name: new FormControl(),
  });
  @Input() dayStartHour: number = 9;
  @Input() dayEndHour: number = 18;
  @Input() weekStartsOn: number = 1;

  constructor(private http: HttpClient, private modal: NgbModal, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.roomNo = this.route.params['_value']['roomId'];
    this.getRooms(this.roomNo);
    this.meetingForm = new FormGroup({
      agenda: new FormControl(),
      date: new FormControl(new Date()),
      start_time: new FormControl(),
      end_time: new FormControl(),
      room_id: new FormControl(this.roomNo),
      name: new FormControl(),
    });
  }


  getRooms(roomId){
    this.http.post('http://localhost:8080/check_availability',  {room_id:roomId}).subscribe((res) =>{
      this.allMeeting = res['response'];
      this.events = [];
      this.allMeeting.forEach((res)=>{
        // get start time 
        const sTime = res.start_time;
        const t1: any = sTime.split(' ');
        const t2: any = t1[0].split(':');
        t2[0] = (t1[1] === 'PM' ? (1*t2[0] + 12) : t2[0]);
        const time24 = (t2[0] < 10 ? '0' + t2[0] : t2[0]) + ':' + t2[1];
        let snewdate = moment(res.date * 1000).toDate().toString();
        const completeSDate = snewdate.replace("00:00", time24.toString());

        // get end time 
        const eTime = res.end_time;
        const et1: any = eTime.split(' ');
        const et2: any = et1[0].split(':');
        et2[0] = (et1[1] === 'PM' ? (1*et2[0] + 12) : et2[0]);
        const etime24 = (et2[0] < 10 ? '0' + et2[0] : et2[0]) + ':' + et2[1];
        let senewdate = moment(res.date * 1000).toDate().toString();
        const completeEDate = senewdate.replace("00:00", etime24.toString());
        console.log(moment(completeSDate).format(), moment(completeEDate).format());
         this.events.push({ 
          start: addHours(startOfDay(moment(completeSDate).toDate()),0),
          end: addHours(moment(completeEDate).toDate(),0),
          title: res.agenda,
          allDay: false,
          color: colors.red,
          actions: this.actions,
          id:res.id
         })
      });
   });
  }

  
  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    console.log(event,action);
   // this.modal.open(this.modalContent, {size: 'lg'});
    if(action == 'Deleted') {
       this.http.post('http://localhost:8080/delete_meeting',  {id:event.id}).subscribe((res) =>{
       
       });
    }
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    debugger;
    this.events = this.events.filter(event => event !== eventToDelete);
    console.log(this.events);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  addNewMeeting(){
    this.meetingForm.value.date = moment(this.meetingForm.value.date).unix();
    this.http.post('http://localhost:8080/insert_meeting',  this.meetingForm.value).subscribe((res)=>{
       this.meetingForm = new FormGroup({
        agenda: new FormControl(),
        date: new FormControl(),
        start_time: new FormControl(),
        end_time: new FormControl(),
        room_id: new FormControl(),
        name: new FormControl(),
      });    
      this.getRooms(this.roomNo);
    });
  }

  myDateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  } 

}
