export interface Task {
    id:number,
    task_name:string,
    task_type:string,
    description:string,
    status:string,
    technician_id:number,
    technician:string,
    technician_image_path:string,
    client_id:number,
    client:string,
    client_image_path:string,
    task_date:string,
}