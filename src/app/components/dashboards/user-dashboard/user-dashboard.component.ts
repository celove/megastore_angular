import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { User } from '../../../models/User';
import { UserService } from '../../../services/auth/user.service';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NgxMaskDirective, NgxMaskService, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FieldsetModule, TableModule, ButtonModule, ConfirmPopupModule, RouterModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {
  statuses: any[] = [];
  maskService = inject(NgxMaskService);
  users: User[] = [];
  rowGroupMetadata: any;
  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);

  activityValues: number[] = [0, 100];

  isExpanded: boolean = false;

  idFrozen: boolean = false;

  loading: boolean = true;

  @ViewChild('filter') filter!: ElementRef;


  ngAfterViewInit() {
    this.userService.getUsers().subscribe((res: User[]) => {
      this.users = res;
    })
  }

  confirm(event: Event, user: User) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir o usuário ' + user.name + ' ?',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      acceptButtonStyleClass: 'p-button-sm',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe((res: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Usuário deletado com sucesso!' })
          this.ngAfterViewInit();
        })
      },
      reject: () => {

      }
    });
  }

  maskCnpj(value: string){
    return this.maskService.applyMask(value, "00.000.000/0000-00");
  }

  maskPhone(value: string){
    return this.maskService.applyMask(value, "(00) 00000-0000");
  }


  addUser() {
    this.router.navigateByUrl('user/new');
  }
}
