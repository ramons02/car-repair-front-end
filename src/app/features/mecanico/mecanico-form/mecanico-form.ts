import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api';
import { Mecanico } from '../../../models/mecanico.model';

@Component({
  selector: 'app-mecanico-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './mecanico-form.html',
  styleUrl: './mecanico-form.css',
})
export class MecanicoForm implements OnInit {
  mecanico: Mecanico = {
    nome: '',
    especialidade: '',
    telefone: '',
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
      this.api.get<Mecanico>(`mecanicos/${id}`).subscribe({
        next: data => {
          this.mecanico = data;
          this.loading.set(false);
        },
        error: () => {
          this.erro.set('Erro ao carregar dados do mecânico.');
          this.loading.set(false);
        },
      });
    }
  }

  salvar(): void {
    this.erro.set('');
    this.salvando.set(true);

    const request = this.editando()
      ? this.api.put<Mecanico>(`mecanicos/${this.mecanico.id}`, this.mecanico)
      : this.api.post<Mecanico>('mecanicos', this.mecanico);

    request.subscribe({
      next: () => this.router.navigate(['/mecanicos']),
      error: () => {
        this.erro.set('Erro ao salvar mecânico. Tente novamente.');
        this.salvando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/mecanicos']);
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length === 0) {
      input.value = '';
    } else if (value.length <= 2) {
      input.value = `(${value}`;
    } else if (value.length <= 6) {
      input.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length <= 10) {
      input.value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
    } else {
      input.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }

    this.mecanico.telefone = input.value;
  }
}
