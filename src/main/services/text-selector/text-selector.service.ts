import {
  ExposableToRenderer,
  exposedToRenderer,
} from '../../expose-renderer.decorator';

@ExposableToRenderer()
export class TextSelectorService {
  @exposedToRenderer()
  async getCarretText() {}
}
