// components/RetirosPage.jsx
'use client';

export default function RetirosPageContent() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Retiro de Haberes</h2>
      <section>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <p className="mb-2">
            La Caja de Ahorro y Previsión Social de los Empleados del SENIAT
            (CAPRES) establece normas claras y transparentes sobre el retiro de
            haberes, ya sea de forma total o parcial, con el fin de proteger los
            derechos de sus asociados y garantizar una gestión responsable de
            los fondos. Estas disposiciones, reguladas en el Capítulo X de los
            Estatutos de CAPRES, definen bajo qué condiciones los asociados
            pueden acceder a sus ahorros, los plazos para la liquidación, y los
            requisitos necesarios para cada tipo de retiro. A continuación, se
            detalla la información clave que todo asociado debe conocer.
          </p>
        </div>

        <ol className="list-decimal ">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <li className="mb-2 font-semibold ml-4">Retiro Total de Haberes</li>
            <p className="mb-2">
              El retiro total de los haberes está permitido únicamente cuando el
              asociado pierda legalmente su condición de tal, según lo previsto
              en los estatutos. En ese caso:
            </p>{' '}
            <ul className="list-disc ml-4">
              <li>
                Se entregará al asociado el saldo líquido disponible en su
                cuenta.
              </li>
              <li>
                Se descontarán previamente cualquier deuda pendiente, como
                préstamos u otras obligaciones con CAPRES.
              </li>
              <li className="mb-2">
                En caso de fallecimiento del asociado, los haberes serán
                entregados a sus herederos legales o a las personas que hubiera
                designado como beneficiarios.
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <li className="mb-2 font-semibold ml-4">
              Plazo para la liquidación
            </li>
            <p>
              CAPRES tiene un plazo establecido para realizar la liquidación de
              los haberes:
            </p>
            <ul className="list-disc ml-4">
              <li>
                <strong>Máximo de 1 mes</strong> para liquidar las cuentas de
                los asociados retirados.
              </li>
              <li>
                En casos de <strong>retiros colectivos</strong>, este plazo
                puede extenderse hasta <strong>3 meses</strong>, siempre que
                existan fondos disponibles.
              </li>
              <li className="mb-2">
                Si ocurren situaciones de <strong>fuerza mayor</strong> no
                imputables a CAPRES, el plazo podrá ampliarse según corresponda.
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <li className="mb-2 font-semibold ml-4">
              Plazo para Retirar los Fondos
            </li>
            <p className="mb-2">
              Una vez liquidado el monto, los exasociados tienen un tiempo
              limitado para reclamar sus haberes:
            </p>
            <ul className="list-disc ml-4">
              <li>
                Deben retirar sus fondos dentro de los{' '}
                <strong>3 años siguientes</strong> a la fecha de retiro.
              </li>
              <li className="mb-2">
                Si no se realiza el retiro en este período, los haberes{' '}
                <strong>
                  se considerarán ingresos extraordinarios de CAPRES
                </strong>
                , y el interesado{' '}
                <strong>pierde definitivamente el derecho</strong> a
                reclamarlos.
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <li className="mb-2 font-semibold ml-4">
              Retiro Parcial de Haberes
            </li>
            <p>
              Los asociados pueden acceder a un retiro parcial de sus ahorros
              bajo ciertas condiciones:
            </p>
            <ul className="list-disc ml-4">
              <li>
                <strong>Un solo retiro parcial al año</strong>, por un monto
                máximo del <strong> 80% de los haberes disponibles</strong>.
              </li>
              <li>
                Debe transcurrir un mínimo de <strong>12 meses</strong> entre un
                retiro y el siguiente.
              </li>
              <li className="mb-2">
                El asociado <strong>no debe tener deudas pendientes</strong> con
                CAPRES al momento de solicitarlo.
              </li>
            </ul>
          </div>

        </ol>
      </section>
    </div>
  );
}
