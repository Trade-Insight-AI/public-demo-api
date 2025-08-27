export abstract class AbstractPresenter<Model, Response> {
  abstract present(entity: Model): Response;
  abstract presentWithoutRelations(entity: Model): Response;
  abstract presentMany(entities: Model[]): Response[];
}
