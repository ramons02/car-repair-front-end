import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api';
import { Page } from '../../models/page.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats = signal({
    clientes: 0,
    veiculos: 0,
    ordensServico: 0,
    mecanicos: 0,
  });
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregarStats();
  }

  carregarStats(): void {
    this.loading.set(true);
    
    const getStat = (endpoint: string) => 
      this.api.get<Page<any>>(`${endpoint}?size=1`).pipe(
        map(res => res.totalElements),
        catchError(() => of(0)) // Se falhar, retorna 0 em vez de quebrar o forkJoin
      );

    forkJoin({
      clientes: getStat('clientes'),
      veiculos: getStat('veiculos'),
      ordensServico: getStat('ordem-servicos'),
      mecanicos: getStat('mecanicos'),
    }).subscribe({
      next: (results) => {
        this.stats.set({
          clientes: results.clientes,
          veiculos: results.veiculos,
          ordensServico: results.ordensServico,
          mecanicos: results.mecanicos,
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas', err);
        this.loading.set(false);
      }
    });
  }
}
