import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { OrdemServico } from '../../../models/ordem-servico.model';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'app-ordem-servico-list',
  imports: [CommonModule],
  templateUrl: './ordem-servico-list.html',
  styleUrl: './ordem-servico-list.css',
})
export class OrdemServicoList implements OnInit {
  ordens = signal<OrdemServico[]>([]);
  loading = signal(false);
  erro = signal('');

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.erro.set('');
    this.api.get<Page<OrdemServico>>('ordem-servicos').subscribe({
      next: data => {
        this.ordens.set(data.content);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar ordens de serviço. Verifique se o servidor está ativo.');
        this.loading.set(false);
      },
    });
  }

  nova(): void {
    this.router.navigate(['/ordens-servico/novo']);
  }

  editar(id: string): void {
    this.router.navigate(['/ordens-servico', id, 'editar']);
  }

  excluir(ordem: OrdemServico): void {
    if (!window.confirm(`Excluir OS #${ordem.id?.slice(0, 8)}?`)) return;
    this.api.delete<void>(`ordem-servicos/${ordem.id}`).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao excluir ordem de serviço.'),
    });
  }

  formatarData(data: string | undefined): string {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
