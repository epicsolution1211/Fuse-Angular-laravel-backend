import { Route } from '@angular/router';
import { CanDeactivateTasksDetails } from '../tasks/tasks.guards';
import { TasksResolver, TasksTagsResolver, TasksTaskResolver } from '../tasks/tasks.resolvers';
import { TasksComponent } from '../tasks/tasks.component';
import { TasksListComponent } from '../tasks/list/list.component';
import { TasksDetailsComponent } from '../tasks/details/details.component';

export const tasksRoutes: Route[] = [
    {
        path     : '',
        component: TasksComponent,
        resolve  : {
            tags: TasksTagsResolver
        },
        children : [
            {
                path     : '',
                component: TasksListComponent,
                resolve  : {
                    tasks: TasksResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : TasksDetailsComponent,
                        resolve      : {
                            task: TasksTaskResolver
                        },
                        canDeactivate: [CanDeactivateTasksDetails]
                    }
                ]
            }
        ]
    }
];
