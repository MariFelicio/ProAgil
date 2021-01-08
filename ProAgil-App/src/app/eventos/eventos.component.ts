import { EventoService } from './../_services/evento.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})

export class EventosComponent implements OnInit {
  titulo = 'Eventos';
  dataEvento!: string;
  eventosFiltrados!: Evento[];
  eventos!: Evento[];
  evento!: Evento;
  modoSalvar = 'post';
  bodyDeleterEvento = '';


  imagemLargura = 50;
  imagemMargem = 2;
  registerForm!: FormGroup;
  bodyDeletarEvento = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService
    ) { }

  _filtroLista!: string;
  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.evento = evento;
    this.registerForm.patchValue(evento);
 }

  novoEvento(template: any){
    this.openModal(template);
    this.modoSalvar = 'post';
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Sucesso');
        }, error => {
          this.toastr.error('Erro ao tentar Deletar');
          console.log(error);
        }
    );
  }
  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  validation() {
    this.registerForm = new FormGroup({
      tema: new FormControl,
      local: new FormControl,
      dataEvento: new FormControl,
      imagemURL: new FormControl,
      qtdPessoas: new FormControl,
      telefone: new FormControl,
      email: new FormControl,
    });
  }




  salvarAlteracao(template: any) {
      if (this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso');
          }, error => {
            this.toastr.error('Erro ao inserir: ${error}');
          }
        );
      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso');
          }, error => {
            this.toastr.error('Erro ao editar: ${error}');
          }
        );
      }
  }


  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos ;
      this.eventosFiltrados = this.eventos;
      }, error => {
        this.toastr.error('Erro ao tentar carregar eventos: ${error}');
      }
    );
  }
}
