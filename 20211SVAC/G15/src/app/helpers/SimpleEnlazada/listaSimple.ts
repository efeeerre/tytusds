import { nodo } from './nodo'

import { Draw } from '../Draw/Draw'
export class listaSimple {
    private primero: nodo
    private ultimo: nodo
    private id: number;
    private draw: Draw

    constructor() {
        this.primero = null
        this.ultimo = null
        this.id = 0;
        this.draw = new Draw()
    }

    async InsertarFinal(dato: number|string, svg, dibujo, duracion) {
        let temp: nodo = new nodo(dato, this.id)
        if (this.primero == null) {//creando primera raiz
            this.primero = temp
            this.ultimo = temp

            let div: any = this.draw.crearNodo(dato, this.id)
            dibujo.appendChild(div)//nodo a final
            this.id++
            await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)//animar nodo
            return temp.getId();
        }


        temp.setId(this.id)
        this.id++

        if (this.primero.getSiguiente() !== this.ultimo && this.primero.getSiguiente() !== null) {
            this.draw.removerElemento("arrowprimero-ultimo")//remover flecha
        }
        //mas nodos
        let div: any = this.draw.crearNodo(dato, temp.getId())
        dibujo.appendChild(div)
        await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)

        let div2 = document.getElementById("nodo" + this.ultimo.getId())//siguiente nodo
        let posiciones = this.draw.posicionesLeft(div, div2)// llamando metodo para unir nodo anterior con siguiente
        posiciones.color = 'black'//dando color flecha
        this.draw.crearPath(this.ultimo.getId() + "-" + temp.getId(), svg, posiciones)//crear flecha


        let aux = this.ultimo
        aux.setSiguiente(temp)
        temp.setSiguiente(this.primero)
        this.ultimo = temp

        return temp.getId();
    }

    async InsertarInicio(dato, svg, dibujo, duracion) {
        let temp: nodo = new nodo(dato, this.id)
        if (this.primero == null) {
            this.primero = temp
            this.ultimo = temp

            let div: any = this.draw.crearNodo(dato, this.id)
            dibujo.appendChild(div)
            this.id++
            await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)
            return temp.getId();
        }
        temp.setId(this.id)
        this.id++

        if (this.primero.getSiguiente() !== this.ultimo && this.primero.getSiguiente() !== null) {
            this.draw.removerElemento("arrowultimo-primero")
        }

        let div: any = this.draw.crearNodo(dato, temp.getId())
        dibujo.insertBefore(div, dibujo.firstChild);
        await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)

        let aux = this.primero
        temp.setSiguiente(aux)
        this.ultimo.setSiguiente(temp)
        this.primero = temp
        this.corregirPaths(svg, this.primero)

        return temp.getId();
    }

    async InsertarOrden(dato, svg, dibujo, duracion) {
        console.log("ente")
        if (this.primero == null) {
            let temp: nodo = new nodo(dato, this.id)
            this.primero = temp
            this.ultimo = temp
            let div: any = this.draw.crearNodo(dato, this.id)
            dibujo.appendChild(div)
            this.id++
            await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)
            return temp.getId();
        }
        if (this.primero.getSiguiente() !== this.ultimo && this.primero.getSiguiente() !== null) {
            this.draw.removerElemento("arrowprimero-ultimo")
        }
        //metodo para cuando sea numero
        if(!isNaN(dato))
        {   
            if (this.primero.getSiguiente() === null) {
                if (Number(dato) <= Number(this.primero.getDato())) await this.InsertarInicio(dato, svg, dibujo, duracion)
                else await this.InsertarFinal(dato, svg, dibujo, duracion)
                return 1
            }
            if (Number(this.primero.getDato()) > Number(dato)) {await this.InsertarInicio(dato, svg, dibujo, duracion)
                return 1
            }

            if (Number(this.primero.getDato())<Number(dato) && Number(dato) < Number(this.primero.getSiguiente().getDato())) {
                let temp: nodo = new nodo(dato, this.id)
                temp.setId(this.id)
                this.id++
                let id1 = this.primero.getId();
                let id2 = this.primero.getSiguiente().getId()
                let aux = this.primero
                temp.setSiguiente(aux.getSiguiente())
                aux.setSiguiente(temp)
                this.draw.removerElemento("arrow" + id1 + "-" + id2)
                let div: any = this.draw.crearNodo(dato, temp.getId())
                dibujo.insertBefore(div, dibujo.children[1]);
                await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)

                this.corregirPaths(svg, this.primero)
                return 1;
            }

            let aux = this.primero
            let index = 0

            do {

                let siguiente = aux.getSiguiente()
                if (Number(dato) >= Number(aux.getDato()) && Number(dato) < Number(siguiente.getDato())) {
                    let temp: nodo = new nodo(dato, this.id)
                    temp.setId(this.id)
                    this.id++

                    let id1 = this.primero.getId();
                    let id2 = this.primero.getSiguiente().getId()
                    temp.setSiguiente(aux.getSiguiente())
                    aux.setSiguiente(temp)
                    this.draw.removerElemento("arrow" + id1 + "-" + id2)
                    let div: any = this.draw.crearNodo(dato, temp.getId())
                    dibujo.insertBefore(div, dibujo.children[index + 1]);
                    await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)
                    this.corregirPaths(svg, this.primero)
                    return 1;

                }

                index++
                aux = aux.getSiguiente()
                if (aux === this.ultimo) break
                if (aux === null) break

            } while (aux != this.primero)

            await this.InsertarFinal(dato, svg, dibujo, duracion)
            return 1
        }else{
            if (this.primero.getSiguiente() === null) {
                if (dato <= this.primero.getDato()) await this.InsertarInicio(dato, svg, dibujo, duracion)
                else await this.InsertarFinal(dato, svg, dibujo, duracion)
                return 1
            }
            if (this.primero.getDato() > dato) {await this.InsertarInicio(dato, svg, dibujo, duracion)
                return 1
            }

            if (this.primero.getDato()<dato && dato < this.primero.getSiguiente().getDato()) {
                let temp: nodo = new nodo(dato, this.id)
                temp.setId(this.id)
                this.id++
                let id1 = this.primero.getId();
                let id2 = this.primero.getSiguiente().getId()
                let aux = this.primero
                temp.setSiguiente(aux.getSiguiente())
                aux.setSiguiente(temp)
                this.draw.removerElemento("arrow" + id1 + "-" + id2)
                let div: any = this.draw.crearNodo(dato, temp.getId())
                dibujo.insertBefore(div, dibujo.children[1]);
                await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)

                this.corregirPaths(svg, this.primero)
                return 1;
            }

            let aux = this.primero
            let index = 0

            do {

                let siguiente = aux.getSiguiente()
                if (dato >= aux.getDato() && dato < siguiente.getDato()) {
                    let temp: nodo = new nodo(dato, this.id)
                    temp.setId(this.id)
                    this.id++

                    let id1 = this.primero.getId();
                    let id2 = this.primero.getSiguiente().getId()
                    temp.setSiguiente(aux.getSiguiente())
                    aux.setSiguiente(temp)
                    this.draw.removerElemento("arrow" + id1 + "-" + id2)
                    let div: any = this.draw.crearNodo(dato, temp.getId())
                    dibujo.insertBefore(div, dibujo.children[index + 1]);
                    await this.draw.animateNode("nodo" + temp.getId(), "zoomIn", duracion)
                    this.corregirPaths(svg, this.primero)
                    return 1;

                }

                index++
                aux = aux.getSiguiente()
                if (aux === this.ultimo) break
                if (aux === null) break

            } while (aux != this.primero)

            await this.InsertarFinal(dato, svg, dibujo, duracion)
            return 1
        }
    }
    
 




    search(dato) {
        let temp = this.primero
        if (temp === null) return null
        do {
            if (temp.getDato() === dato) return temp;
            temp = temp.getSiguiente()
            if (temp === null) break;
        } while (temp != this.primero)

        return null
    }

    async searchAnimation(dato, duration) {
        console.log(this.primero)
        let temp = this.primero
        let i = 0
        if (temp === null) return null
        do {
            await this.draw.animateNode("nodo" + temp.getId(), 'bounceIn', duration);
            console.log(temp.getDato())
            if (!isNaN(dato)) {
                if (Number(temp.getDato()) === Number(dato)) return { nodo: temp, index: i };
                temp = temp.getSiguiente()
                i++;
            }else{
                if (temp.getDato() === dato) return { nodo: temp, index: i };
                temp = temp.getSiguiente()
                i++;
            }

            
            if (temp === null) break;
        } while (temp != this.primero)

        return null
    }

    getPrimero() {
        return this.primero
    }

    getUltimo() {
        return this.ultimo
    }


    corregirPaths(svg, nodo) {
        this.draw.removerElemento("arrowultimo-primero")
        this.draw.removerElemento("arrowprimero-ultimo")

        let temp = nodo
        if (nodo !== this.ultimo) {
            do {

                let siguiente = temp.getSiguiente()
                if (siguiente !== null) {
                    let id1 = temp.getId()
                    let id2 = siguiente.getId()

                    this.draw.removerElemento("arrow" + id2 + "-" + id1)
                    this.draw.removerElemento("arrow" + id1 + "-" + id2)
                    let div1 = document.getElementById("nodo" + id1)
                    let div2 = document.getElementById("nodo" + id2)

                    let pos = this.draw.posicionesRight(div1, div2)
                    pos.color = 'black'
                    pos.x1 -= 20
                    pos.x2 -= 55
                    this.draw.crearPath(id1 + "-" + id2, svg, pos)

                }
                temp = temp.getSiguiente();
                if (temp === null) break;
                if (temp === this.ultimo) break;
            } while (temp !== this.ultimo)
        }


       // this.crearUltimos(svg)
    }

}