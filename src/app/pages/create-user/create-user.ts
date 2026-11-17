import { Component , OnInit} from '@angular/core';
import { RouterLink , Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule , Validators , FormControl , FormGroup } from '@angular/forms';
interface RoleOption {
  Id : number;
  Name : string;
}

@Component({
  imports: [RouterLink , ReactiveFormsModule],
  selector: 'app-create-user',
  styleUrl: './create-user.css',
  templateUrl: './create-user.html',
})
export class CreateUser implements OnInit{
  accountName : string;

  constructor (private readonly auth : Auth , private readonly router : Router)
  {
    this.accountName = this.auth.getAccountName() ?? 'Account';
  }

    readonly createUsers = new FormGroup({
      firstName : new FormControl('' , {
        nonNullable : true,
        validators : [Validators.required]
      }),
      lastName : new FormControl('' , {
        nonNullable : true,
        validators : [Validators.required]
      }),
      email : new FormControl('' ,  {
        nonNullable : true ,
        validators : [Validators.required , Validators.email]
      }),
      cellNumber : new FormControl('' , 
        {
          nonNullable : true
        }),
      roleId : new FormControl<number | null> (null, Validators.required)
    })

  roles : RoleOption[] = [];

  ngOnInit(): void {
    this.auth.getRoles().subscribe({
      next : (respone : unknown) => {
        const result = respone as {data ?: RoleOption[]}
        this.roles = Array.isArray(result.data) ? result.data : [];
      },

      error : (error) => {
        console.error('Role list request failed' , error);
      }
    })
  }

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() : void 
  {
    if(this.createUsers.invalid || this.isSubmitting)
    {
      this.createUsers.markAllAsTouched()
      return
    }

    const {firstName , lastName , email , cellNumber , roleId} = 
    this.createUsers.getRawValue();

    if(roleId === null)
    {
      return
    }

    this.isSubmitting = true ;
    this.successMessage = ''
    this.errorMessage = ''

    this.auth.createUser(firstName , lastName , email , cellNumber , roleId).subscribe({
      next : (response : unknown) => {
        const result = response as {
          status ?: string;
          message ?: string;
          Message ?: string;
        };

        if(result.status?.toLowerCase() === 'error')
        {
          this.errorMessage = result.message ?? result.Message ?? 'User creation failed';
        }

        else
        {
          this.successMessage = result.message ?? result.Message ?? 'User created successfully!'
          this.createUsers.reset({
            firstName : "" ,
            lastName : '',
            email : '',
            cellNumber : '',
            roleId : null
          })
        }

        this.isSubmitting = false;
      },
      error : (error) => {
        console.error('Create User request failed' , error);

        this.errorMessage = 'User creation failed. Please try again';
        this.isSubmitting = false;
        
      }
    })
  }

  logout() : void 
  {
    this.auth.clearAccessToken();
    void this.router.navigateByUrl('/login');
  }
}
