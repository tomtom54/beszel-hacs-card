class BeszelCard extends HTMLElement {
  setConfig(config) {
    if (!config.token || !config.url) {
      throw new Error("Merci de fournir une URL et un token Beszel.");
    }
    this._config = config;
  }

  async fetchBeszelData() {
    try {
      const response = await fetch(`${this._config.url}/api/machines`, {
        headers: {
          "Authorization": `Bearer ${this._config.token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des données Beszel:", error);
      return { error: error.message };
    }
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._config || !this._hass) {
      this.innerHTML = `<ha-card><div class="card-content">Configuration ou HASS manquant.</div></ha-card>`;
      return;
    }

    this.fetchBeszelData().then(data => {
      if (data.error) {
        this.innerHTML = `<ha-card><div class="card-content">Erreur: ${data.error}</div></ha-card>`;
      } else {
        this.innerHTML = `
          <ha-card>
            <div class="card-header">
              <h1>Beszel Dashboard</h1>
            </div>
            <div class="card-content">
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
          </ha-card>
        `;
      }
    });
  }
}

customElements.define("beszel-card", BeszelCard);