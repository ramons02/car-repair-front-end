import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { Cliente } from '../../../models/cliente.model';
import { Page } from '../../../models/page.model';
import { MaskPipe } from '../../../shared/pipes/mask.pipe';

@Component({
  selector: 'app-cliente-list',
  imports: [CommonModule, MaskPipe],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {
  clientes = signal<Cliente[]>([]);
  loading = signal(false);
  erro = signal('');

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.erro.set('');
    this.api.get<Page<Cliente>>('clientes').subscribe({
      next: data => {
        this.clientes.set(data.content);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar clientes. Verifique se o servidor está ativo.');
        this.loading.set(false);
      },
    });
  }

  novo(): void {
    this.router.navigate(['/clientes/novo']);
  }

  editar(id: string): void {
    this.router.navigate(['/clientes', id, 'editar']);
  }

  excluir(cliente: Cliente): void {
    if (!window.confirm(`Excluir cliente "${cliente.nome}"?`)) return;
    this.api.delete<void>(`clientes/${cliente.id}`).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao excluir cliente.'),
    });
  }
}
