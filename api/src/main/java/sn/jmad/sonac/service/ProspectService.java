package sn.jmad.sonac.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import sn.jmad.sonac.model.Prospect;
import sn.jmad.sonac.repository.ProspectRepository;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class ProspectService {

	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";

	@Autowired

	ProspectRepository prospectRepository;

	/*
	 * Méthode pour exporter des fichiers pdf et excel des prospects
	 */
	public void generateReportProspect(HttpServletResponse response, String reportFormat, String title,
			String demandeur, String dateDebut, String dateFin, Long periodeNombreMois) {

		String caractSup = "_" ;
		String titleNew = "" ;
		String demandeurNew = "" ;
		
		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");
		
		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_PROSPECT_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<Prospect> prospects;

				if (!(dateDebut.equals("0") || dateDebut.equals("")) && (dateFin.equals("0") || dateFin.equals("")) && periodeNombreMois == 0) {
					prospects = prospectRepository.allProspectNonTransformesApartirDuMois(dateDebut);

				} else if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals("")) && periodeNombreMois == 0) {
					prospects = prospectRepository.allProspectNonTransformesParPeriode(dateDebut, dateFin);

				} else if (periodeNombreMois != 0 && (dateDebut.equals("0") || dateDebut.equals("")) && (dateFin.equals("0") || dateFin.equals(""))) {
					prospects = prospectRepository.allProspectNonTransformesDepuisXMois(periodeNombreMois + " months");

				} else {
					prospects = prospectRepository.findAllProspect();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(prospects);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_PROSPECT_PDF + ParamConst.EXTENSION_PDF);
				response.addHeader (" Access-Control-Allow-Origin "," * ");

				JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Traitement pour un fichier excel (XLS)
		 */
		if (reportFormat.equalsIgnoreCase(EXCEL)) {

			InputStream jasperStream = this.getClass().getResourceAsStream(ParamConst.REPORT_FOLDER
					+ ParamConst.FILENAME_REPORT_PROSPECT_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
				

				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<Prospect> prospects;

//				if (!(dateDebut.equals("0") || dateDebut.equals("")) && periodeNombreMois == 0) {
//					prospects = prospectRepository.allProspectNonTransformesApartirDuMois(dateDebut);
//
//				} else if (periodeNombreMois != 0 && (dateDebut.equals("0") || dateDebut.equals(""))) {
//					prospects = prospectRepository.allProspectNonTransformesDepuisXMois(periodeNombreMois + " months");
//
//				} else {
//					prospects = prospectRepository.findAllProspect();
//				}
				
				if (!(dateDebut.equals("0") || dateDebut.equals("")) && (dateFin.equals("0") || dateFin.equals("")) && periodeNombreMois == 0) {
					prospects = prospectRepository.allProspectNonTransformesApartirDuMois(dateDebut);

				} else if (!(dateDebut.equals("0") || dateDebut.equals("")) && !(dateFin.equals("0") || dateFin.equals("")) && periodeNombreMois == 0) {
					prospects = prospectRepository.allProspectNonTransformesParPeriode(dateDebut, dateFin);

				} else if (periodeNombreMois != 0 && (dateDebut.equals("0") || dateDebut.equals("")) && (dateFin.equals("0") || dateFin.equals(""))) {
					prospects = prospectRepository.allProspectNonTransformesDepuisXMois(periodeNombreMois + " months");

				} else {
					prospects = prospectRepository.findAllProspect();
				}

				JRDataSource jrDataSource = new JRBeanCollectionDataSource(prospects);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition", "inline; filename="
						+ ParamConst.FILENAME_REPORT_PROSPECT_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				// Supprimer les sauts de ligne sur excel
				
				exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
				exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
