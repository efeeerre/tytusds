import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ListaSimpleEnlazada from './impl-estructuras/lista-simple-enlaz';
import ListaPadre from './impl-estructuras/lista-padre';
import Pila from './impl-estructuras/pila';
import Cola from './impl-estructuras/cola';
import ListaDobleEnlazada from './impl-estructuras/lista-doble-enlaz';
import ListaCircularSimple from './impl-estructuras/lista-circular-simple';
import ListaCircularDoble from './impl-estructuras/lista-circular-doble';
import { routerTransition } from '../../router.animations';
import { RectanguloNodo} from './impl-canvas/rectangulo-nodo';
import {Flecha} from './impl-canvas/flecha';
import { Subscription } from 'rxjs';
import {JsonNodo,JsonNodoPrioridad,JsonSalidaNodoPrioridad} from './impl-estructuras/json-nodo';
import {FlechaCompuesta} from './impl-canvas/flecha-compuesta';
import ColaPrioridad from './impl-estructuras/cola-prioridad';

@Component({
  selector: 'app-listas-edd',
  templateUrl: './listas-edd.component.html',
  styleUrls: ['./listas-edd.component.css'],
    animations: [routerTransition()]
})
export class ListasEddComponent implements OnInit {
  paramsSubscription: Subscription;
  public idTipoLista=0;
  listaEnlArray:string[]=[];
  listaEnlJSon:string;
  listaEnlazada:any;
  velocidadAnimacion=10;
  public radioData: any; 
  opcionOperar: string;
  valorNodoInsertar:string;
  valorIndiceActualizar:string;
  valorNodoActualizar:string;
  prioridad:string; 
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  rectangulosNodos: RectanguloNodo[] = [];
  private anchoNodo=160;
  private anchoNodoHead=100;
  private altoNodo=30;
  private anchoFlecha=2;
  private colorFlecha='black';
  tituloLista:string;
  lblBtnAgregar:string;
  lblBtnBorrar:string;
  strCarga:string;
  colorFondoCanvas='black';

  //constructor(private ngZone: NgZone) { }
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.idTipoLista = +params['idTipoLista'];
      switch(this.idTipoLista){
        case 1:this.tituloLista="Lista simple enlazada"; this.lblBtnAgregar="Agregar";
                this.lblBtnBorrar="Borrar"; this.listaEnlazada = new ListaSimpleEnlazada();
                this.cambiarPagina();
                break; 
        case 2:this.tituloLista="Lista doble enlazada"; this.lblBtnAgregar="Agregar";
                this.lblBtnBorrar="Borrar"; this.listaEnlazada = new ListaDobleEnlazada();
                this.cambiarPagina();
                break; 
        case 3:this.tituloLista="Lista circular simplemente enlazada"; this.lblBtnAgregar="Agregar";
                this.lblBtnBorrar="Borrar"; this.listaEnlazada = new ListaCircularSimple();
                this.cambiarPagina();
                break; 
        case 4:this.tituloLista="Lista circular doblemente enlazada";this.lblBtnAgregar="Agregar";
                this.lblBtnBorrar="Borrar"; this.listaEnlazada = new ListaCircularDoble();
                this.cambiarPagina();
                break; 
        case 5:this.tituloLista="Pila"; this.lblBtnAgregar="Push";
                this.lblBtnBorrar="Pop"; this.listaEnlazada = new Pila();
                this.cambiarPagina();
                break; 
        case 6:this.tituloLista="Cola"; this.lblBtnAgregar="Encolar";
                this.lblBtnBorrar="Descencolar"; this.listaEnlazada = new Cola();
                this.cambiarPagina();
                break; 
        case 7:this.tituloLista="Cola Prioridad"; this.lblBtnAgregar="Encolar";
                this.lblBtnBorrar="Descencolar"; this.listaEnlazada = new ColaPrioridad();
                this.cambiarPagina();
                break; 
      }
    });
    this.listaEnlJSon="";
    this.radioData = 1;
    this.opcionOperar='Inicio';
  }
  cambiarPagina(){
    this.borrarCanvas();
    this.rectangulosNodos=[];
    this.listaEnlJSon='';
    this.valorIndiceActualizar='';
    this.valorNodoActualizar='';
  }
  borrarCanvas(){
    this.ctx.fillStyle = this.colorFondoCanvas;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.beginPath();
  }
  actualizarListaStr(){
    this.listaEnlArray = this.listaEnlazada.toArray();
    let i =0;
    if(this.idTipoLista==7){
      let jsonNodoArray= new JsonNodoPrioridad("Estructura Lineal",this.tituloLista,this.listaEnlazada.toArrayJson());
      this.listaEnlJSon = JSON.stringify(jsonNodoArray);
    }else{
      let jsonNodoArray= new JsonNodo("Estructura Lineal",this.tituloLista,this.listaEnlArray);
      this.listaEnlJSon = JSON.stringify(jsonNodoArray);
    }
  }
  clickAgregarNodo() {
    if(this.valorNodoInsertar!=null && this.valorNodoInsertar!=''){
      this.agregarNodo(this.valorNodoInsertar);
      this.valorNodoInsertar=''; this.prioridad='';
    }
  }
  agregarNodo(valorInsertar:string){
    //Si no es pila o cola, aplica si inserta al inicio o final
    if(this.idTipoLista>=1&&this.idTipoLista<=4){
      if(this.opcionOperar=='Inicio'){
        this.listaEnlazada.agregarAlInicio(valorInsertar);
      }
      else{
        this.listaEnlazada.agregarAlFinal(valorInsertar);
      }
    } //pila
    else if(this.idTipoLista==5){
      this.listaEnlazada.push(valorInsertar);
    } //cola
    else if(this.idTipoLista==6){
      this.listaEnlazada.encolar(valorInsertar);
    } //cola prioridad
    else if(this.idTipoLista==7){
      if(this.prioridad!=null&&this.prioridad!='')
        this.listaEnlazada.encolar(valorInsertar,this.prioridad);
    }
    this.actualizarListaStr();
    this.pintarNodos();
  }
  clickActualizarNodo(){
    this.listaEnlazada.actualizar(this.valorIndiceActualizar, this.valorNodoActualizar);
    this.actualizarListaStr();
    this.pintarNodos();
  }
  clickBorrarNodo(){
    //Si no es pila o cola, aplica borrar al inicio o final
    if(this.idTipoLista>=1&&this.idTipoLista<=4){
      if(this.opcionOperar=='Inicio'){
        this.listaEnlazada.borrarAlInicio();
      }
      else{ 
        this.listaEnlazada.borrarAlFinal();
      }
    }else if(this.idTipoLista==5){
      this.listaEnlazada.pop();
    }else{
      this.listaEnlazada.desencolar();
    }
    this.actualizarListaStr();
    this.pintarNodos();
  }

  clickCargar(){
    let strIntoObj = JSON.parse(this.strCarga);
    console.log(strIntoObj);
    if(strIntoObj.animacion!=undefined&&strIntoObj.animacion!=null){
      this.velocidadAnimacion=strIntoObj.animacion;
    }
    for (let valorStrNodo of strIntoObj.valores) {
      if(this.idTipoLista==7){
        this.prioridad=valorStrNodo.prioridad;
        this.agregarNodo(valorStrNodo.valor);
      } 
      else this.agregarNodo(valorStrNodo);
    }
  }

  /*Se borra canvas, se recorre lista dinamica pintando los nodos y flechas*/ 
  pintarNodos(){
    this.borrarCanvas();
    let x=0,y=1,i=1;
    let nuevoNodo,tempNodo, primerNodo;
    let animar=true;
    console.log('lenght:'+this.rectangulosNodos.length)
    if(this.rectangulosNodos.length>0) animar=false;
    nuevoNodo= new RectanguloNodo(this.ctx, 'Inicio',x,y,this.anchoNodoHead,this.altoNodo,false,animar);
    this.rectangulosNodos = this.rectangulosNodos.concat(nuevoNodo);
    y=3; let posFlech='arriba';
    for (let valorStrNodo of this.listaEnlArray) {
      tempNodo=nuevoNodo;
      if(i==this.listaEnlArray.length) animar = true;
      else animar = false;
      nuevoNodo= new RectanguloNodo(this.ctx, valorStrNodo, x,y,this.anchoNodo,this.altoNodo,
        this.idTipoLista==2||this.idTipoLista==4,animar);
        this.rectangulosNodos = this.rectangulosNodos.concat(nuevoNodo);
      if(i==1) primerNodo=nuevoNodo;
      if(tempNodo!=null&&nuevoNodo!=null){
        let flecha1= new Flecha(this.ctx,  tempNodo.xCola, tempNodo.yCola, nuevoNodo.xHead,
           nuevoNodo.yCola,this.anchoFlecha, this.colorFlecha);
        if((this.idTipoLista==2||this.idTipoLista==4)&&(tempNodo.getTexto()!='Inicio')){
          let flecha2= new FlechaCompuesta(this.ctx, nuevoNodo.xCola-15, nuevoNodo.yCola, tempNodo.xHead+20,
            tempNodo.yCola,this.anchoFlecha, this.colorFlecha,posFlech);
            if(posFlech=='arriba') posFlech='abajo';
            else posFlech='arriba';
        }
        if((this.idTipoLista==2||this.idTipoLista==4)&&i==this.listaEnlArray.length&&i>1){
          if(y==3){
            let flecha3= new FlechaCompuesta(this.ctx, nuevoNodo.xCola-15, nuevoNodo.yCola, primerNodo.xHead+20,
            primerNodo.yCola,this.anchoFlecha, this.colorFlecha,posFlech);
          }else{
            let flecha3= new Flecha(this.ctx, nuevoNodo.xCola-15, nuevoNodo.yCola, primerNodo.xHead+20,
              primerNodo.yCola,this.anchoFlecha, this.colorFlecha);
          }
        }
        tempNodo.drawText(); nuevoNodo.drawText();
      }
      x+=1.5;
      if(x*this.anchoNodo>=this.ctx.canvas.width-100){
        y+=2; x=0;
      }
      i++;
    }
    clearInterval(this.interval);
    this.interval=
    setInterval(() => {
      this.tick();
    }, 10 - this.velocidadAnimacion);    
  }
  tick() {
    this.borrarCanvas();
    this.drawBorder();
    this.rectangulosNodos.forEach((square: RectanguloNodo) => {
      square.animar();
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  drawBorder() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.ctx.canvas.width, 0);
    this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.lineTo(0, this.ctx.canvas.height);
    this.ctx.lineTo(0, 0);
    this.ctx.stroke();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

}
