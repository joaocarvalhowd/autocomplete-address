import Correios from './Correios';

class AutocompleteAddress {

  constructor(options = {}) {
    this.options = {
      fields: {},
      events: ['keyup'],
      listenBtn: false,
      listenBtnId: null,
    };

    this.correios = new Correios();

    this.resolveOptions(options);

    const ZipcodeOptions = this.options.fields.zipcode;
    this.field_zipcode = document.querySelector(`${ZipcodeOptions.type}[${ZipcodeOptions.attr}="${ZipcodeOptions.name}"]`);

    this.listenInput();

    if (this.options.listenBtn && typeof this.options.listenBtnId === 'string') {
      this.listenBtn(this.options.listenBtnId);
    }
  }

  resolveOptions(options) {
    this.options.listenBtn = (typeof options.listenBtn === 'boolean') ? options.listenBtn : this.options.listenBtn;
    this.options.listenBtnId = (typeof options.listenBtnId === 'string') ? options.listenBtnId : this.options.listenBtnId;

    this.options.events = (typeof options.events === 'object') ? Object.assign({}, this.options.events, options.events) : this.options.events;

    this.options.fields.zipcode = (options.fields && typeof options.fields.zipcode === 'object') ? Object.assign({}, this.defaultZipcode(), options.fields.zipcode) : this.defaultZipcode();
    this.options.fields.street = (options.fields && typeof options.fields.street === 'object') ? Object.assign({}, this.defaultStreet(), options.fields.street) : this.defaultStreet();
    this.options.fields.neighborhood = (options.fields && typeof options.fields.neighborhood === 'object') ? Object.assign({}, this.defaultNeighborhood(), options.fields.neighborhood) : this.defaultNeighborhood();
    this.options.fields.state = (options.fields && typeof options.fields.state === 'object') ? Object.assign({}, this.defaultState(), options.fields.state) : this.defaultState();
    this.options.fields.city = (options.fields && typeof options.fields.city === 'object') ? Object.assign({}, this.defaultCity(), options.fields.city) : this.defaultCity();
  }

  listenInput() {
    const events = this.options.events;

    if (events.length > 0) {
      events.forEach((event) => {
        this.field_zipcode.addEventListener(event, this.handleZipcode.bind(this));
      });
    }
  }

  listenBtn(id) {
    const btn = document.querySelector(`#${id}`);

    btn.addEventListener('click', this.handleZipcode.bind(this));
  }

  handleZipcode() {
    const InputValue = this.field_zipcode.value;

    this.correios.find(InputValue)
            .then((response) => {
              const fields = this.options.fields;

              const street = document.querySelector(`${fields.street.type}[${fields.street.attr}="${fields.street.name}"]`);
              const neighborhood = document.querySelector(`${fields.neighborhood.type}[${fields.neighborhood.attr}="${fields.neighborhood.name}"]`);
              const state = document.querySelector(`${fields.state.type}[${fields.state.attr}="${fields.state.name}"]`);
              const city = document.querySelector(`${fields.city.type}[${fields.city.attr}="${fields.city.name}"]`);

              street.value = response.endereco;
              neighborhood.value = response.bairro;
              state.value = response.estado;
              city.value = response.cidade;
            })
            .catch(() => {
            });
  }

  defaultZipcode() {
    return {
      name: 'zipcode',
      type: 'input',
      attr: 'name',
    };
  }

  defaultStreet() {
    return {
      name: 'street',
      type: 'input',
      attr: 'name',
    };
  }

  defaultNeighborhood() {
    return {
      name: 'neighborhood',
      type: 'input',
      attr: 'name',
    };
  }

  defaultState() {
    return {
      name: 'state',
      type: 'input',
      attr: 'name',
    };
  }

  defaultCity() {
    return {
      name: 'city',
      type: 'input',
      attr: 'name',
    };
  }

}

window.AutocompleteAddress = AutocompleteAddress;

// Polyfill
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value(target) {
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      const to = Object(target);
      for (let i = 1; i < arguments.length; i++) {
        let nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        const keysArray = Object.keys(Object(nextSource));
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    },
  });
}

export default AutocompleteAddress;
