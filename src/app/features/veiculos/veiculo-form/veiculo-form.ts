import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api';
import { Veiculo } from '../../../models/veiculo.model';

@Component({
  selector: 'app-veiculo-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './veiculo-form.html',
  styleUrl: './veiculo-form.css',
})
export class VeiculoForm implements OnInit {
  veiculo: Veiculo = {
    marca: '', modelo: '', anoFabricacao: null,
    anoModelo: null, placa: '', cor: '',
  };

  readonly anoAtual = new Date().getFullYear();

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
      this.api.get<Veiculo>(`veiculos/${id}`).subscribe({
        next: data => {
          if (data.placa) {
            let p = data.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (p.length > 3) {
              p = p.substring(0, 3) + '-' + p.substring(3);
            }
            data.placa = p;
          }
          this.veiculo = data;
          this.loading.set(false);
        },
        error: () => {
          this.erro.set('Erro ao carregar dados do veículo.');
          this.loading.set(false);
        },
      });
    }
  }

  salvar(): void {
    this.erro.set('');
    this.salvando.set(true);

    const request = this.editando()
      ? this.api.put<Veiculo>(`veiculos/${this.veiculo.id}`, this.veiculo)
      : this.api.post<Veiculo>('veiculos', this.veiculo);

    request.subscribe({
      next: () => this.router.navigate(['/veiculos']),
      error: (err: { status: number }) => {
        if (err.status === 409) {
          this.erro.set('Placa já cadastrada. Verifique os dados e tente novamente.');
        } else if (err.status === 400) {
          this.erro.set('Dados inválidos. Verifique os campos obrigatórios.');
        } else {
          this.erro.set('Erro ao salvar veículo. Tente novamente.');
        }
        this.salvando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/veiculos']);
  }

  onPlacaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let p = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (p.length > 7) {
      p = p.substring(0, 7);
    }
    if (p.length > 3) {
      p = p.substring(0, 3) + '-' + p.substring(3);
    }
    input.value = p;
    this.veiculo.placa = p;
  }
}
