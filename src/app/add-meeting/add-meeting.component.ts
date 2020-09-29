import { Component, OnInit,ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css']
})
export class AddMeetingComponent implements OnInit {
  allRooms = [{id:1, name: 'Room 1', status:'Available'},{id:2, name: 'Room 2', status:'Available'},{id:3, name: 'Room 3', status:'Available'},{id:4, name: 'Room 4', status:'Available'},{id:5, name: 'Room 5', status:'Available'},{id:6, name: 'Room 6', status:'Available'},{id:7, name: 'Room 7', status:'Available'},{id:8, name: 'Room 8', status:'Available'},{id:9, name: 'Room 9',status:'Available'},{id:10, name: 'Room 10', status:'Available'},];
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getStatus();
  }

  getStatus(){
    for(let x = 0; x < this.allRooms.length; x++){
      this.http.post('http://localhost:8080/get_rooms',  {id:this.allRooms[x].id}).subscribe((res)=>{
        if(res['response'][0]){
          if(this.allRooms[x].id == res['response'][0].room_id){
            this.allRooms[x]['meetings'] = res['response'];

            this.allRooms[x]['meetings'].forEach(ele => {

              let currentDate = new Date();
              const sTime = ele.start_time;
              const t1: any = sTime.split(' ');
              const t2: any = t1[0].split(':');
              t2[0] = (t1[1] === 'PM' ? (1*t2[0] + 12) : t2[0]);
              const time24 = (t2[0] < 10 ? '0' + t2[0] : t2[0]) + ':' + t2[1];

              const eTime = ele.end_time;
              const et1: any = eTime.split(' ');
              const et2: any = et1[0].split(':');
              et2[0] = (et1[1] === 'PM' ? (1*et2[0] + 12) : et2[0]);
              const etime24 = (et2[0] < 10 ? '0' + et2[0] : et2[0]) + ':' + et2[1];
            
              const xy = new Date(currentDate);
              const cTime = xy.getHours() + ':' + xy.getMinutes()
               console.log(ele);
              if(time24 <= cTime && etime24 >= cTime){
                this.allRooms[x].status = 'Booked by ' + ele.name + ' - Duration :' + time24 + ' - ' +etime24;
              } else {
                this.allRooms[x].status = 'Available';
              }
            });
          }
        }
      });  
    }
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
}