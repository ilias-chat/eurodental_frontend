import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TechnitiansComboboxComponent } from '../../../../shared/technitians-combobox/technitians-combobox.component';

@Component({
  selector: 'app-reassign-form',
  standalone: true,
  imports: [TechnitiansComboboxComponent],
  templateUrl: './reassign-form.component.html',
  styleUrl: './reassign-form.component.css'
})
export class ReassignFormComponent {
  is_progresbar_open = signal<boolean>(false);

  technician_id:number = 0

  @Input({required:true}) tasks_ids = signal<number[]>([]);

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  on_combo_technicians_change(technician:{id:number, full_name:string, image_path:string}){
    this.technician_id = technician.id;
  }

  on_save_btn_click(){
    if(this.technician_id === 0){
      return;
    }

    this.show_progresbar();
    console.log(this.technician_id, this.tasks_ids());
    this.save.emit();
  }

  on_close_btn_click(){
    this.technician_id = 0;
    this.close.emit();
  }

  show_progresbar(){
    this.is_progresbar_open.set(true);
  }

  hide_progresbar(){
    this.is_progresbar_open.set(false);
  }

}
