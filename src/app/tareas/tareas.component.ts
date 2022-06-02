import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, subscribeOn } from 'rxjs';
import { TareaService } from '../tarea.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  tareas: any[] = [];
  formulario: FormGroup = this.fb.group({
    nombre: [],
    completado: [false]
  });
  tareaEnEdicion: any;

  constructor(
    private tareaService: TareaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.tareaService.getAll()
      .subscribe((tareas: any) => {
        console.log(this.tareas);
        this.tareas = tareas._embedded.tareas;
      })
  }

  save(id?: number){
    const values = this.formulario.value;
    console.log(values);

    let request: Observable<any>;

    if (this.tareaEnEdicion){
      console.log('editando');
      request = this.tareaService.update(this.tareaEnEdicion.id,
        { 
          id: this.tareaEnEdicion.id,
          nombre: values.nombre, 
          completado: values.completado
        });
      
    } else {
      console.log('creando');
      request = this.tareaService.create(values);
    }
    
    request.subscribe({
        next: () => {
          this.getAll();
          this.resetFormulario();
        },
        error: (error)=> {
          console.log(error);
        },
        complete: ()=> {
          console.log("complete");
        }
      });
  }

  resetFormulario(){
    this.formulario.setValue({
      nombre: '',
      completado: false
    });
    this.tareaEnEdicion = null;
  }

  delete(id: number){
    const ok = confirm('¿Estas seguro que deseas eliminar?');
    if (ok){
      this.tareaService.delete(id)
        .subscribe(()=> {
          this.getAll();
          this.resetFormulario();
        });
    }
  }

  edit(tarea: any){
    this.tareaEnEdicion = tarea;

    this.formulario.setValue({
      nombre: tarea.nombre,
      completado: tarea.completado
    })
  }

}
