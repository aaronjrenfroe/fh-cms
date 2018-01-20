import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TreeviewItem, TreeviewComponent, TreeviewConfig } from 'ngx-treeview';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'event-tree',
  templateUrl: './event-tree.component.html',
  styleUrls: ['./event-tree.component.css']
})
export class EventTreeComponent implements OnInit {

  @Input('prechecked') prechecked: any[];

  @Output() seletedChanged = new EventEmitter();

  selectedEvents = [];
  valueToIDTable = {};
  allEvents = [];
  treeviewItems : TreeviewItem[];
  treeviewConfig = {
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: window.screen.height - 400
  };

  constructor(public postService: PostService) {
    
    
  }

  ngOnInit() {
    this.postService.getAllEvents((events) => {
      this.allEvents = events;
      this.treeviewItems = this.createTreeStructure(events);
    });
    
  }
  // Creates a tree based of an array of events with multiple properties
  createTreeStructure(eventList: Array<any>) {
    
    let treeviewItems : TreeviewItem[] = [];

    let years = Array.from(new Set(eventList.map( ev => ev['EventYear']))).sort( (a : number, b: number ) => {return a - b;});
    let topValue = '0';
    
    this.valueToIDTable = {};
    // YEARS
    years.forEach(year => {
      
      let yearBranch = new TreeviewItem({
        text: String(year), value: topValue +'-'+ year
      });

      let eventsForYear = eventList.filter(event => { return event['EventYear'] == year });
      let programs = Array.from(new Set(eventsForYear.map( ev => ev['EventTypeName']))).sort();
      // PROGRAM / EVENT TYPE
      programs.forEach(program => {

        let programBranch = new TreeviewItem({
          text:program,
          value: topValue + '-' + year + '-' + program
        });

        let eventsForProgramForYear = eventsForYear.filter(ev => { return ev['EventTypeName'] == program });
        let locations = Array.from(new Set(eventsForProgramForYear.map( ev => ev['LocationName']))).sort();

        // LOCATIONS
        locations.forEach(location => {
          let locationBranch = new TreeviewItem({
            text:location, value: topValue + '-' + year + '-' + program + '-' + location
          });
          let eventsAtLocationForProgramForYear = eventsForProgramForYear.filter(ev => { return ev['LocationName'] == location});

          eventsAtLocationForProgramForYear.forEach(eventAtLForPForY => {
            let value = topValue + '-' + year + '-' + (program as String).replace(' ', '') + '-' + eventAtLForPForY['EventID'];
            this.valueToIDTable[value] = eventAtLForPForY;
            // Event Leafs
            let checked = false;
            if(this.prechecked.indexOf(eventAtLForPForY['EventID']) != -1){
              checked = true;
            }
            let eventLeaf = new TreeviewItem({text:eventAtLForPForY['EventName'], value: value, checked });

            if(!locationBranch.children){
              locationBranch.children = [eventLeaf];
            }else{
              locationBranch.children.push(eventLeaf);
            }
            locationBranch.correctChecked();
          });
          if(!programBranch.children){
            programBranch.children = [locationBranch];
          }else{
            programBranch.children.push(locationBranch);
          }
          programBranch.correctChecked();
          
        });
        // end of location forEach
        if(!yearBranch.children){
          yearBranch.children = [programBranch];
        }else{
          yearBranch.children.push(programBranch);
        }
        yearBranch.correctChecked();
      });
      // end of program forEach
      treeviewItems.push(yearBranch);
      
    });
    // end of year forEach
    return treeviewItems;
    
  }
  onSelectedChange(event){

    this.selectedEvents = (event as string[]).map(value => {
      let tags = "";
      let selEvent = this.valueToIDTable[value]
      
      for(let key in selEvent){
        let value = ''.concat(selEvent[key]);
        value = value.replace('(','');
        value = value.replace(')','');
        value = value.replace('/','');
        value = value.replace('\\','');
        value = value.replace('\n','');
        value = value.replace('\r','');
        tags += ' ' + value;
      }
      return {eventId: selEvent.EventID, tags};
    });
    this.seletedChanged.emit({selected:this.selectedEvents, total: this.allEvents.length});
  }
}
