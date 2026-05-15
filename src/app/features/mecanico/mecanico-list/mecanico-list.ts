import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { Mecanico } from '../../../models/mecanico.model';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'app-mecanico-list',
  imports: [CommonModule],
  templateUrl: './mecanico-list.html',
  styleUrl: './mecanico-list.css',
})
export class MecanicoList implements OnInit {
  mecanicos = signal<Mecanico[]>([]);
  loading = signal(false);
  erro = signal('');

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.erro.set('');
    this.api.get<Page<Mecanico>>('mecanicos').subscribe({
      next: data => {
        this.mecanicos.set(data.content);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar mecânicos. Verifique se o servidor está ativo.');
        this.loading.set(false);
      },
    });
  }

  novo(): void {
    this.router.navigate(['/mecanicos/novo']);
  }

  editar(id: string): void {
    this.router.navigate(['/mecanicos', id, 'editar']);
  }

  excluir(mecanico: Mecanico): void {
    if (!window.confirm(`Excluir mecânico "${mecanico.nome}"?`)) return;
    this.api.delete<void>(`mecanicos/${mecanico.id}`).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao excluir mecânico.'),
    });
  }
}
