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
}
