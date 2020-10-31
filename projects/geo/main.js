/* global ymaps */
class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    const coords = await this.getCoords();
    for (const item of coords) {
      for (let i = 0; i < item.total; i++) {
        this.map.createPlacemark(item.coords);
      }
    }      
    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }
    
  getCoords() {
    const coords = [];

    for (const item in this.data) {
      coords.push({
        coords: item.split('_')
      });
    }

    return coords;
  }

  createForm(coords, reviews) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = document.querySelector('.review-list');
    const reviewForm = document.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review-item');
      div.innerHTML = `<div><b>${item.name}</b>[${item.place}]</div><div>${item.text}</div>`;
      reviewList.appendChild(div);
    }
    return root;
  }

  async onClick(coords) {
    this.map.openBalloon(coords, this.formTemplate);
    const data = {
      coords,
      review: {
        name: "",
        place: "",
        text: "",
      }
    };
    const form = this.createForm(coords, data);
    this.map.setBalloonContent(form.innerHTML);
  }

  async onDocumentClick(e) {
    if (e.target.dataset.role === 'review-add') {
      const name = document.querySelector('[data-role=review-name]');
      const place = document.querySelector('[data-role=review-place]');
      const text = document.querySelector('[data-role=review-text]');
      
      const storage = localStorage;
      
      storage.data = JSON.stringify({
        name: name.value,
        place: place.value,
        text: text.value
      })

      this.map.createPlacemark(coords);
      this.map.closeBalloon();
    };
      
    // const reviewForm = document.querySelector('[data-role=review-form]');
    // const coords = JSON.parse(reviewForm.dataset.coords);
    // const data = {
    //   coords,
    //   review: {
    //     name: document.querySelector('[data-role=review-name]').value,
    //     place: document.querySelector('[data-role=review-place]').value,
    //     text: document.querySelector('[data-role=review-text]').value,
    //   },
    // };
    
  }
}

class InteractiveMap {
  constructor(mapId, onClick) {
    this.mapId = mapId;
    this.onClick = onClick;
  }

  async init() {
    await this.loadYMaps();
    this.initMap();
  }
  
  loadYMaps() {
    return new Promise((resolve) => ymaps.ready(resolve));
  }

  initMap() {
    this.clusterer = new ymaps.Clusterer({
      groupByCoordinates: true,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: false,
    });

    this.clusterer.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      this.onClick(coords);
    });

    this.map = new ymaps.Map(this.mapId, {
      center: [55.76, 37.64],
      zoom: 10,
    });

    this.map.events.add('click', (e) => this.onClick(e.get('coords')));
    this.map.geoObjects.add(this.clusterer);
  }

  openBalloon(coords, content) {
    this.map.balloon.open(coords, content);
  }

  setBalloonContent(content) {
    this.map.balloon.setData(content);
  }

  closeBalloon() {
    this.map.balloon.close();
  }

  createPlacemark(coords) {
    const placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      this.onClick(coords);
    });
    this.clusterer.add(placemark);
  }
}

new GeoReview();