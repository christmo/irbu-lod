<?php

require_once('../../../../dll/php/conexionBD.php');
require_once('../../../../dll/fpdf/fpdf.php');

extract($_GET);

class PDF extends FPDF {

    // Tabla coloreada
    function FancyTable($header, $data) {
        // Colores, ancho de línea y fuente en negrita
        $this->SetFillColor(255, 140, 0);
        $this->SetTextColor(255);
        $this->SetDrawColor(0, 0, 0);
        $this->SetLineWidth(.3);
        $this->SetFont('Helvetica', 'B', 12);
        // Cabecera
        $w = array(25, 35, 100,50,50);
        for ($i = 0; $i < count($header); $i++){
            $this->Cell($w[$i], 7, $header[$i], 1, 0, 'C', true);
        }
        $this->Ln();
        // Restauración de colores y fuentes
        $this->SetFillColor(224, 235, 255);
        $this->SetTextColor(0);
        $this->SetFont('Helvetica', '', 12);
        // Datos
        $fill = false;
        $j=0;
        foreach ($data as $row) {
            $this->Cell($w[0], 6, $row[0], 'LR', 0, 'C', $fill);
            $this->Cell($w[1], 6, $row[1], 'LR', 0, 'C', $fill);
            $this->Cell($w[2], 6, $row[2], 'LR', 0, 'L', $fill);
            $this->Cell($w[3], 6, $row[3], 'LR', 0, 'R', $fill);
            $this->Cell($w[4], 6, $row[4], 'LR', 0, 'R', $fill);
            $this->Ln();
            $fill = !$fill;
            $j++;
        }
        // Línea de cierre
        $this->Cell(array_sum($w), 0, '', 'T');
    }

    function Titulo($title) {
        // Arial bold 15
        $this->SetFont('Helvetica', 'B', 18);
        // Calculamos ancho y posición del título.
        $w = $this->GetStringWidth($title) + 6;
        $this->SetX((280 - $w) / 2);
        // Título
        $this->Cell($w, 9, $title, 1, 1, 'C', false);
        // Salto de línea
        $this->Ln(10);
    }

}

if ($periodo == 'Todos') {
    $consultaSql = "SELECT CI_EST, DIR_EST, LAT_CASA, LON_CASA FROM viviendas
                        WHERE FECHA_HORA in (
                        SELECT MAX(FECHA_HORA)
                        FROM viviendas
                        GROUP BY CI_EST)";
} else {
    $consultaSql = "SELECT CI_EST, DIR_EST, LAT_CASA, LON_CASA FROM viviendas
                        WHERE FECHA_HORA in (
                        SELECT MAX(FECHA_HORA)
                        FROM viviendas
                        WHERE PERIODO='$periodo'
                        GROUP BY CI_EST)";
}

consulta($consultaSql);
$resulset = variasFilas();

$data = array();
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $aux[] = ($i + 1);
    $aux[] = $fila["CI_EST"];
    $aux[] = utf8_decode($fila["DIR_EST"]);
    $aux[] = $fila["LAT_CASA"];
    $aux[] = $fila["LON_CASA"];
    $data[] = $aux;
    $aux = null;
}


$pdf = new PDF();
$title = utf8_decode('Reporte de Número de Estudiantes');

// Títulos de las columnas
$header = array('# Est', utf8_decode("Cédula"), utf8_decode("Dirección"),'Latitud','Longitud');
$pdf->SetFont('Helvetica', '', 12);

$pdf->SetTopMargin(20);
$pdf->SetLeftMargin(20);
$pdf->SetRightMargin(20);
$pdf->AddPage('L', 'A4');

$pdf->Titulo($title);
$pdf->FancyTable($header, $data);
$pdf->Output();
?>