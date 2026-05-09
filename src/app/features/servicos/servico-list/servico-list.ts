import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { Servico } from '../../../models/servico.model';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'app-servico-list',
  imports: [CommonModule],
  templateUrl: './servico-list.html',
  styleUrl: './servico-list.css',
})
export class ServicoList implements OnInit {
  servicos = signal<Servico[]>([]);
  loading = signal(false);
  erro = signal('');

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.erro.set('');
    this.api.get<Page<Servico>>('servicos').subscribe({
      next: data => {
        this.servicos.set(data.content);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar serviços. Verifique se o servidor está ativo.');
        this.loading.set(false);
      },
    });
  }

  novo(): void {
    this.router.navigate(['/servicos/novo']);
  }

  editar(id: string): void {
    this.router.navigate(['/servicos', id, 'editar']);
  }

  excluir(servico: Servico): void {
    if (!window.confirm(`Excluir serviço "${servico.descricao}"?`)) return;
    this.api.delete<void>(`servicos/${servico.id}`).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao excluir serviço.'),
    });
  }

  formatarData(data: string): string {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
