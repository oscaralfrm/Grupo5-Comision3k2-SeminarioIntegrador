import React from 'react';

const DashBoard = () => {
  return (
    <div className="container-fluid">
      <div className="row mt-4">
        {/* Earnings Monthly */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">EARNINGS (MONTHLY)</h5>
              <p className="card-text">$40,000</p>
            </div>
          </div>
        </div>

        {/* Earnings Annual */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">EARNINGS (ANNUAL)</h5>
              <p className="card-text">$215,000</p>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">TASKS</h5>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                  50%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">PENDING REQUESTS</h5>
              <p className="card-text">18</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Earnings Overview Chart */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Earnings Overview</h5>
              {/* Aquí puedes agregar el gráfico con una librería de gráficos */}
            </div>
          </div>
        </div>

        {/* Revenue Sources Pie Chart */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Revenue Sources</h5>
              {/* Aquí puedes agregar un gráfico de pastel */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
