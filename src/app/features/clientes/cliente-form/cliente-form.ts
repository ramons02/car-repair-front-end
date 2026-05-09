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

  salvar(): void {
    this.erro.set('');
    this.salvando.set(true);

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
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}
