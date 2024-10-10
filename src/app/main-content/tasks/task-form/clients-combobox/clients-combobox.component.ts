import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientsService } from '../../../clients/clients.service';

interface Client{
  id:number,
  full_name:string,
  image_path:string,
}

@Component({
  selector: 'app-clients-combobox',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clients-combobox.component.html',
  styleUrl: './clients-combobox.component.css'
})
export class ClientsComboboxComponent {
  @Input({required:true}) value:string = '';

  @ViewChild('combobox_input') combobox_input!:ElementRef;
  @ViewChild('options_list') options_list!:ElementRef;

  @Output() change = new EventEmitter<Client>();

  search_input_value = signal<string>('');

  clients = signal<Client[]>([]);

  @Input() is_valid:boolean = true;

  private cilents_service = inject(ClientsService);

  ngOnInit(){
    this.cilents_service.all().subscribe({
      next:(respond_data)=>{
        this.clients.set(respond_data.map((cl)=>{
          return {id:cl.id, full_name: cl.first_name+' '+cl.last_name, image_path:cl.image_path}
        }))
      },
    })
  }

  public get get_clients() :Client[] {
    return this.clients().filter((tech)=>{
      return tech.full_name.toLowerCase().includes(this.search_input_value().toLowerCase());
    });
  }
    
  toggle_options() {
    this.search_input_value.set('');
    this.options_list.nativeElement.classList.toggle('hidden');
  };

  hide_options() {
    this.options_list.nativeElement.classList.add('hidden');
  };

  select_option(event:Event) {
    this.value = (event.target as HTMLDivElement).innerHTML;
    this.hide_options();
    this.search_input_value.set('');

    const client_id = (event.target as HTMLDivElement).getAttribute('data-client_id');
    this.change.emit(this.get_client_by_id(Number(client_id)));
  }
  

  get_client_by_id(client_id:number):Client{
    const index:number = this.clients().findIndex(client => client.id === client_id);
    return index!==-1?this.clients()[index]:{id:0, full_name:'', image_path:''};
  }
}
