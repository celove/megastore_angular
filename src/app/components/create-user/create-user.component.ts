import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import cep from 'cep-promise';
import { UserService } from '../../services/auth/user.service';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-user',
  standalone: true,
  templateUrl: './create-user.component.html',
  imports: [FormsModule, InputTextModule, InputTextareaModule, ButtonModule, CommonModule, NgxMaskDirective, PanelModule, FieldsetModule],
  styleUrls: ['./create-user.component.scss'],
  providers: [provideNgxMask()]
})
export class CreateUserComponent {
  router = inject(Router);
  userService = inject(UserService);
  messageService = inject(MessageService);
  @ViewChild('userForm') userForm!: NgForm;
  user = this.userService.newUser();
  fieldsDisabled = true;


  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      let id = params['id'];
      if(id != "new"){
        this.userService.getUser(id).subscribe(res => {
          this.user = res;
        })
      } else {
        this.fieldsDisabled = false;
      }
    });
  }

  onBlurCep(value: string | number) {
    cep(value)
      .then(add => {
        console.log(add);

        this.user.address.city = add.city;
        this.user.address.state = add.state;
        this.user.address.neighborhood = add.neighborhood;
        this.user.address.street = add.street;
      })
  }

  submitForm() {
    if (this.userForm.valid) {
      if(this.user.id == ''){
        this.userService.createUser(this.user).subscribe(() => { 
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Usuário cadastrado com sucesso!' })
          this.router.navigateByUrl('/dashboard-user');
        });
      } else {
        this.userService.updateUser(this.user).subscribe(() => { 
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Usuário atualizado com sucesso!' })
          this.router.navigateByUrl('/dashboard-user');
        });
      }
      // Handle form submission logic, such as sending the user data to a server
    } else {
      console.error('Form is invalid');
    }
  }

  edit() {
    this.fieldsDisabled = false;
  }

  clearForm() {
    this.userForm.reset();
  }
}
