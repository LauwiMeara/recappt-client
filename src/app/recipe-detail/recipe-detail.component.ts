import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent {
  protected recipe?: Recipe;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.setRecipe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected markNextStep(): void {
    if (this.recipe) {
      const activeStep = this.recipe?.steps.filter((step) => step.isActive)[0];
      if (!activeStep) {
        this.recipe.steps[0].isActive = true;
      } else {
        activeStep.isActive = false;
        if (activeStep.number < this.recipe.steps.length) {
          this.recipe.steps[activeStep.number].isActive = true;
        }
      }
    }
  }

  protected goBack(): void {
    this.location.back();
  }

  private setRecipe(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.subscriptions.push(this.recipeService.getRecipe(id).subscribe((recipe) => (this.recipe = recipe)));
  }

  @HostListener('window:keydown.space', ['$event'])
  private onSpacebar(event: KeyboardEvent): void {
    event.preventDefault(); // prevent default space bar 'scroll down' browser behavior
    this.markNextStep();
  }
}
