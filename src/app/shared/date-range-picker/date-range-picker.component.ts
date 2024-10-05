import { Component, ElementRef, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.css'
})
export class DateRangePickerComponent {

  current_month!:number;
  current_year!:number;
  current_day!:number;
  selected_range:{ start:Date|undefined, end:Date|undefined } = {start:undefined, end: undefined};

  calendar_month!:number;
  calendar_year!:number;
  
  month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  date_range = signal('');

  @ViewChild('days') days_element!: ElementRef;
  @ViewChild('month_label') month_label_element!: ElementRef;

  ngAfterViewInit(){
    this.current_month = new Date().getMonth();
    this.current_year = new Date().getFullYear();
    this.current_day = new Date().getDay() -1;
    this.selected_range.start = new Date(this.current_year, this.current_month, this.current_day);
    this.selected_range.end = new Date(this.current_year, this.current_month, this.current_day);

    this.calendar_month = this.current_month;
    this.calendar_year = this.current_year;

    this.date_range.set(`Selected Range: ${this.format_date(this.selected_range.start)} - ${this.selected_range.end ? this.format_date(this.selected_range.end) : ''}`);

    this.render_calendar();
  }
  
  render_calendar() {

      const days:HTMLDivElement[] = this.days_element.nativeElement.querySelectorAll('.day');
      days.forEach((day:HTMLDivElement) => {
        day.innerHTML = '';
        day.classList.remove('selected');
        day.classList.remove('in_range');
      });
  
      const start_calendar = new Date(this.calendar_year, this.calendar_month).getDay();
      const days_in_month = new Date(this.calendar_year, this.calendar_month + 1, 0).getDate();
      const end_calendar = days_in_month + start_calendar;
  
      this.month_label_element.nativeElement.textContent = `${this.month_names[this.calendar_month]} ${this.calendar_year}`;

      for(let i = start_calendar; i <  end_calendar; i++){
        const day = i - start_calendar + 1
        days[i].innerHTML = (day).toString();

        if (this.is_in_range(day, this.calendar_month, this.calendar_year)) {
          days[i].classList.add('in_range');
        }

        if (this.is_selected(day, this.calendar_month, this.calendar_year)) {
          days[i].classList.add('selected');
        }
      }

  }
  
  is_selected(day:number, month:number, year:number) {
      const date = new Date(year, month, day);
      if (this.selected_range.start !== undefined && this.selected_range.end !== undefined) {
          return date.getTime() === this.selected_range.start.getTime() || date.getTime() === this.selected_range.end.getTime();
      }
      return date.getTime() === this.selected_range.start?.getTime();
  }
  
  is_in_range(day:number, month:number, year:number) {
      const date = new Date(year, month, day);
      if (this.selected_range.start !== undefined && this.selected_range.end !== undefined) {
          return date.getTime() > this.selected_range.start.getTime() && date.getTime() < this.selected_range.end.getTime();
      }
      return false;
  }
  
  select_date(event: Event) {
    const day:number = Number((event.target as HTMLDivElement).innerHTML);
    const month:number = this.calendar_month;
    const year:number = this.calendar_year;

    const selected_date = new Date(year, month, day);
  
      if (!this.selected_range.start || this.selected_range.end) {
          this.selected_range.start = selected_date;
          this.selected_range.end = undefined;
      } else if (selected_date.getTime() < this.selected_range.start.getTime()) {
          this.selected_range.end = this.selected_range.start;
          this.selected_range.start = selected_date;
      } else {
          this.selected_range.end = selected_date;
      }

      this.render_calendar();
  
      this.date_range.set(`Selected Range: ${this.format_date(this.selected_range.start)} - ${this.selected_range.end ? this.format_date(this.selected_range.end) : ''}`);
  }
  
  format_date(date:Date) {
      return date ? `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}` : '';
  }
  
  change_month(direction:number) {
    this.calendar_month += direction;
    if (this.calendar_month < 0) {
        this.calendar_month = 11;
        this.calendar_year--;
    } else if (this.calendar_month > 11) {
        this.calendar_month = 0;
        this.calendar_year++;
    }
    this.render_calendar();
  }

}
