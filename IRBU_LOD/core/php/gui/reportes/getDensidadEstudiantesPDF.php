<?php

require_once('../../../../dll/php/conexionBD.php');
require_once('../../../../dll/fpdf/fpdf.php');

extract($_GET);

class PDF extends FPDF {

    // Tabla coloreada
    function FancyTable($header, $data) {
        // Colores, ancho de línea y fuente en negrita
        $this->SetFillColor(255, 0, 0);
        $this->SetTextColor(255);
        $this->SetDrawColor(128, 0, 0);
        $this->SetLineWidth(.3);
        $this->SetFont('', 'B');
        // Cabecera
        $w = array(30, 100, 40);
        for ($i = 0; $i < count($header); $i++)
            $this->Cell($w[$i], 7, $header[$i], 1, 0, 'C', true);
        $this->Ln();
        // Restauración de colores y fuentes
        $this->SetFillColor(224, 235, 255);
        $this->SetTextColor(0);
        $this->SetFont('');
        // Datos
        $fill = false;
        foreach ($data as $row) {
            $this->Cell($w[0], 6, number_format($row[0]), 'LR', 0, 'C', $fill);
            $this->Cell($w[1], 6, $row[1], 'LR', 0, 'L', $fill);
            $this->Cell($w[2], 6, number_format($row[2]), 'LR', 0, 'C', $fill);
            $this->Ln();
            $fill = !$fill;
        }
        // Línea de cierre
        $this->Cell(array_sum($w), 0, '', 'T');
    }

    function Titulo($title) {
        // Arial bold 15
        $this->SetFont('Helvetica', 'B', 15);
        // Calculamos ancho y posición del título.
        $w = $this->GetStringWidth($title) + 6;
        $this->SetX((210 - $w) / 2);
        // Título
        $this->Cell($w, 9, $title, 1, 1, 'C', false);
        // Salto de línea
        $this->Ln(10);
    }

}

if ($periodo == 'Todos') {
    $consultaSql = "SELECT p.direccion as parada, count(*) as estudiantes, dir_img
                FROM paradas p, parada_estudiante pe
                WHERE P.ID_PARADA = PE.ID_PARADA
                GROUP BY p.id_parada";
} else {
    $consultaSql = "SELECT p.direccion as parada, count(*) as estudiantes, dir_img
                FROM paradas p, parada_estudiante pe
                WHERE P.ID_PARADA = PE.ID_PARADA
                AND PE.PERIODO = '$periodo'
                GROUP BY p.id_parada";
}

consulta($consultaSql);
$resulset = variasFilas();

$data = array();
for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $aux[] = ($i + 1);
    $aux[] = utf8_decode($fila["parada"]);
    $aux[] = $fila["estudiantes"];
    $data[] = $aux;
    $aux = null;
}


$pdf = new PDF();
$title = utf8_decode('Reporte de Número de Estudiantes por Parada');

// Títulos de las columnas
$header = array('# Paradas', 'Paradas', '# Estudiantes');
$pdf->SetFont('Helvetica', '', 14);

$pdf->SetTopMargin(30);
$pdf->SetLeftMargin(20);
$pdf->SetRightMargin(20);
$pdf->AddPage('L', 'A4');

$pdf->Titulo($title);
$pdf->FancyTable($header, $data);
$pdf->Output();
?>