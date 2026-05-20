import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api';
import { Cliente } from '../../../models/cliente.model';
import { InputMaskDirective } from '../../../shared/directives/input-mask.directive';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, FormsModule, InputMaskDirective],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  cliente: Cliente = {
    nome: '', cpf: '', telefone: '', endereco: '',
    bairro: '', cidade: '', estado: '', cep: '',
  };

  editando = signal(false);
  loading = signal(false);
  salvando = signal(false);
  erro = signal('');

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando.set(true);
      this.loading.set(true);
      this.api.get<Cliente>(`clientes/${id}`).subscribe({
        next: data => {
          this.cliente = data;
          this.loading.set(false);
        },
        error: () => {
          this.erro.set('Erro ao carregar dados do cliente.');
          this.loading.set(false);
        },
      });
    }
  }

  private isCpfValido(cpf: string): boolean {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return false;
    
    return true;
  }

  salvar(): void {
    if (!this.isCpfValido(this.cliente.cpf)) {
      this.erro.set('O CPF informado é inválido. Verifique os dígitos e tente novamente.');
      return;
    }

    this.erro.set('');
    this.salvando.set(true);

    this.api.get<Page<Cliente>>('clientes?size=1000').subscribe({
      next: (data) => {
        const cpfExiste = data.content.some(
          c => c.cpf === this.cliente.cpf && c.id !== this.cliente.id
        );

        if (cpfExiste) {
          this.erro.set('CPF já cadastrado. Verifique os dados e tente novamente.');
          this.salvando.set(false);
          return;
        }

        const request = this.editando()
          ? this.api.put<Cliente>(`clientes/${this.cliente.id}`, this.cliente)
          : this.api.post<Cliente>('clientes', this.cliente);

        request.subscribe({
          next: () => this.router.navigate(['/clientes']),
          error: (err: { status: number }) => {
            if (err.status === 409) {
              this.erro.set('CPF já cadastrado. Verifique os dados e tente novamente.');
            } else if (err.status === 400) {
              this.erro.set('Dados inválidos. Verifique os campos obrigatórios.');
            } else {
              this.erro.set('Erro ao salvar cliente. Tente novamente.');
            }
            this.salvando.set(false);
          },
        });
      },
      error: () => {
        this.erro.set('Erro ao verificar unicidade do CPF. Tente novamente.');
        this.salvando.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
