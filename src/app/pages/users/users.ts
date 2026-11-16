import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ElementRef } from '@angular/core';
interface UserRow {
  FirstName: string;
  LastName: string;
  Email: string;
  RoleName?: string;
  Status?: string;
  LastLogin?: string | null;
}

function createUsersPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Rows per page';
  paginatorIntl.getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return `Showing 0 of ${length}`;
    }

    const start = page * pageSize + 1;
    const end = Math.min(start + pageSize - 1, length);
    return `Showing ${start} - ${end} of ${length}`;
  };
  return paginatorIntl;
}

@Component({
  selector: 'app-users',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, RouterLink],
  providers: [{ provide: MatPaginatorIntl, useFactory: createUsersPaginatorIntl }],
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users implements OnInit, AfterViewInit {
  accountName = 'Account';
  readonly displayedColumns = [
    'FirstName',
    'LastName',
    'Email',
    'RoleName',
    'Status',
    'LastLogin',
    'actions',
  ];

  readonly dataSource = new MatTableDataSource<UserRow>([]);
  readonly pageSizeOptions = [10, 25, 50, 100];
  @ViewChild(MatSort) sort!: MatSort;

  totalUsers = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = false;
  loadError = '';

  constructor(private readonly auth: Auth, private readonly router: Router) {
    this.accountName = auth.getAccountName() ?? 'Account';
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.loadError = '';

    this.auth.getUser(this.pageIndex + 1 , this.pageSize , this.searchText).subscribe({
      next: (response: unknown) => {
        const result = response as {
          data?: {
            users?: UserRow[];
            totalUsers?: number;
          };
        };

        this.dataSource.data = Array.isArray(result.data?.users)
          ? result.data.users
          : [];
        this.totalUsers = result.data?.totalUsers ?? 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('User list request failed:', error);
        this.dataSource.data = [];
        this.loadError = error.error?.message ?? 'Unable to load users. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  logout(): void {
    this.auth.clearAccessToken();
    void this.router.navigateByUrl('/login');
  }

  isSearchOpen = false;

  @ViewChild('searchInput') searchInput ?: ElementRef<HTMLInputElement>;

  toggleSearch() : void {
    this.isSearchOpen = !this.isSearchOpen;

    if(this.isSearchOpen)
    {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      })
    }
  }

  searchText = '';

  searchUsers() : void
  {
    console.log('Searching'  , this.searchText);
    
    this.pageIndex = 0;
    this.loadUsers();
  }

  private searchTimer ?: ReturnType<typeof setTimeout>;

  onSearchInput(value : string) : void 
  {
    this.searchText = value;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => 
      this.searchUsers() , 300)
  }

  highlight(value: string | null | undefined) : string
  {
    const text = value ?? '';
    const term = this.searchText.trim();

    if(!term)
    {
      return text;
    }

    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return text.replace(
    new RegExp(`(${escapedTerm})`, 'gi'),
    '<mark>$1</mark>'
  );
  }
}
