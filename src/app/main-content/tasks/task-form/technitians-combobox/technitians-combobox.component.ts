import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Technician{
  id:number,
  full_name:string,
  image_path:string,
}

@Component({
  selector: 'app-technitians-combobox',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './technitians-combobox.component.html',
  styleUrl: './technitians-combobox.component.css'
})
export class TechnitiansComboboxComponent {
  
  @Input({required:true}) value:string = '';

  @ViewChild('combobox_input') combobox_input!:ElementRef;
  @ViewChild('options_list') options_list!:ElementRef;

  @Output() change = new EventEmitter<Technician>();

  search_input_value = signal<string>('');

  technicians = signal<Technician[]>([
    {
      id:1,
      full_name:'technitian01',
      image_path:'',
    },
    {
      id:2,
      full_name:'technitian02',
      image_path:'',
    },
    {
      id:3,
      full_name:'technitian03',
      image_path:'',
    },
  ]);

  public get get_technicians() :Technician[] {
    return this.technicians().filter((tech)=>{
      return tech.full_name.toLowerCase().includes(this.search_input_value().toLowerCase());
    });
  }
    
  toggle_options() {
    this.options_list.nativeElement.classList.toggle('hidden');
  };

  hide_options() {
    this.options_list.nativeElement.classList.add('hidden');
  };

  hide_options_on_input_blue(){
    //if()
  }

  // Select an option and display it in the input
  select_option(event:Event) {
    this.combobox_input.nativeElement.value = (event.target as HTMLDivElement).innerHTML;
    this.hide_options();
    this.search_input_value.set('');

    const technician_id = (event.target as HTMLDivElement).getAttribute('data-technician_id');
    this.change.emit(this.get_technician_by_id(Number(technician_id)));
  }
  

  get_technician_by_id(technician_id:number):Technician{
    const index:number = this.technicians().findIndex(technician => technician.id === technician_id);
    return index!==-1?this.technicians()[index]:{id:0, full_name:'', image_path:''};
  }

}
