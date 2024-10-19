import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, signal } from '@angular/core';
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

  private http = inject(HttpClient);
  private api_url = 'http://35.180.66.24/api/v1/users/?profile_name=technicien';
  
  @Input({required:true}) value:string = '';
  @Input() is_valid:boolean = false;

  @ViewChild('combobox_input') combobox_input!:ElementRef;
  @ViewChild('options_list') options_list!:ElementRef;

  @Output() change = new EventEmitter<Technician>();

  search_input_value = signal<string>('');

  technicians = signal<Technician[]>([]);

  ngOnInit(){
    this.get_all_technicians();
  }

  public get get_technicians() :Technician[] {
    return this.technicians().filter((tech)=>{
      return tech.full_name.toLowerCase().includes(this.search_input_value().toLowerCase());
    });
  }

  get_all_technicians(){
    this.http.get<Technician[]>(this.api_url).subscribe({
      next:(respond_data)=>{
        this.technicians.set(respond_data);
      },
      error:(err)=>{
        console.error(err);
      },
    })
  }
    
  toggle_options() {
    this.options_list.nativeElement.classList.toggle('hidden');
  };

  hide_options() {
    this.options_list.nativeElement.classList.add('hidden');
  };

  // Select an option and display it in the input
  select_option(event:Event) {
    this.combobox_input.nativeElement.value = (event.target as HTMLDivElement).innerHTML;
    this.is_valid = false;
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
