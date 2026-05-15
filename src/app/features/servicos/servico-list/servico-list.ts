import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { Servico } from '../../../models/servico.model';
import { Mecanico } from '../../../models/mecanico.model';
import { Page } from '../../../models/page.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-servico-list',
  imports: [CommonModule],
  templateUrl: './servico-list.html',
  styleUrl: './servico-list.css',
})
export class ServicoList implements OnInit {
  servicos = signal<Servico[]>([]);
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
    
    forkJoin({
      servicos: this.api.get<Page<Servico>>('servicos'),
      mecanicos: this.api.get<Page<Mecanico>>('mecanicos'),
    }).subscribe({
      next: ({ servicos, mecanicos }) => {
        this.servicos.set(servicos.content);
        this.mecanicos.set(mecanicos.content);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar dados. Verifique se o servidor está ativo.');
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

  getMecanicoNome(mecanicoId: string): string {
    const mecanico = this.mecanicos().find(m => m.id === mecanicoId);
    return mecanico ? mecanico.nome : 'N/A';
  }
}
