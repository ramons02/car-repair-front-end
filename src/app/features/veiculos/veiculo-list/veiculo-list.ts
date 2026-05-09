import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { Veiculo } from '../../../models/veiculo.model';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'app-veiculo-list',
  imports: [CommonModule],
  templateUrl: './veiculo-list.html',
  styleUrl: './veiculo-list.css',
})
export class VeiculoList implements OnInit {
  veiculos = signal<Veiculo[]>([]);
  loading = signal(false);
  erro = signal('');

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.erro.set('');
    this.api.get<Page<Veiculo>>('veiculos').subscribe({
      next: data => {
        this.veiculos.set(data.content);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar veículos. Verifique se o servidor está ativo.');
        this.loading.set(false);
      },
    });
  }

  novo(): void {
    this.router.navigate(['/veiculos/novo']);
  }

  editar(id: string): void {
    this.router.navigate(['/veiculos', id, 'editar']);
  }

  excluir(veiculo: Veiculo): void {
    if (!window.confirm(`Excluir veículo "${veiculo.placa} - ${veiculo.modelo}"?`)) return;
    this.api.delete<void>(`veiculos/${veiculo.id}`).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao excluir veículo.'),
    });
  }
}
