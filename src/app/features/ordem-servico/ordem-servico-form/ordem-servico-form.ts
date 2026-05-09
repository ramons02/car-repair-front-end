import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api';
import { OrdemServico } from '../../../models/ordem-servico.model';
import { Cliente } from '../../../models/cliente.model';
import { Veiculo } from '../../../models/veiculo.model';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'app-ordem-servico-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './ordem-servico-form.html',
  styleUrl: './ordem-servico-form.css',
})
export class OrdemServicoForm implements OnInit {
  ordem: OrdemServico = {
    clienteId: '', veiculoId: '',
    dataEntrada: '', problema: '',
  };

  clientes: Cliente[] = [];
  veiculos: Veiculo[] = [];

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
    this.loading.set(true);

    forkJoin({
      clientes: this.api.get<Page<Cliente>>('clientes'),
      veiculos: this.api.get<Page<Veiculo>>('veiculos'),
    }).subscribe({
      next: ({ clientes, veiculos }) => {
        this.clientes = clientes.content;
        this.veiculos = veiculos.content;
        this.loading.set(false);
        this.carregarOrdem();
      },
      error: () => {
        this.erro.set('Erro ao carregar clientes e veículos.');
        this.loading.set(false);
      },
    });
  }

  get saidaInvalida(): boolean {
    const entrada = this.ordem.dataEntrada;
    const saida = this.ordem.dataSaida;
    return !!(entrada && saida && saida < entrada);
  }

  private carregarOrdem(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.editando.set(true);
    this.api.get<OrdemServico>(`ordem-servicos/${id}`).subscribe({
      next: data => {
        this.ordem = data;
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar dados da ordem de serviço.');
        this.loading.set(false);
      },
    });
  }

  salvar(): void {
    if (this.saidaInvalida) {
      this.erro.set('A data de saída não pode ser anterior à data de entrada.');
      return;
    }

    this.erro.set('');
    this.salvando.set(true);

    const request = this.editando()
      ? this.api.put<OrdemServico>(`ordem-servicos/${this.ordem.id}`, this.ordem)
      : this.api.post<OrdemServico>('ordem-servicos', this.ordem);

    request.subscribe({
      next: () => this.router.navigate(['/ordens-servico']),
      error: (err: { status: number }) => {
        if (err.status === 400) {
          this.erro.set('Dados inválidos. Verifique os campos obrigatórios.');
        } else if (err.status === 422) {
          this.erro.set('Cliente ou veículo inválido.');
        } else {
          this.erro.set('Erro ao salvar ordem de serviço. Tente novamente.');
        }
        this.salvando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/ordens-servico']);
  }
}
