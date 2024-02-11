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
import sn.jmad.sonac.message.response.CategorieBranche;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.repository.AcheteurRepository;
import sn.jmad.sonac.service.constantes.ParamConst;

@Service
public class AcheteurService {
	private static final String PDF = "pdf";
	private static final String EXCEL = "excel";

	@Autowired
	AcheteurRepository acheteurRepository;

	public void generateReportAcheteur(HttpServletResponse response, String reportFormat, String title,
			String demandeur) {
		
		String caractSup = "_" ;
		String titleNew = "" ;
		String demandeurNew = "" ;
		
		titleNew = title.replaceAll(caractSup, " ");
		demandeurNew = demandeur.replaceAll(caractSup, " ");

		/*
		 * Traitement pour un fichier PDF
		 */
		if (reportFormat.equalsIgnoreCase(PDF)) {
			
			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACHETEUR_PDF + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();

//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<Acheteur> categories = acheteurRepository.findAll();
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(categories);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-pdf");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_ACHETEUR_PDF + ParamConst.EXTENSION_PDF);
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
			
			InputStream jasperStream = this.getClass().getResourceAsStream(
					ParamConst.REPORT_FOLDER + ParamConst.FILENAME_REPORT_ACHETEUR_EXCEL + ParamConst.EXTENSION_REPORT);
			JasperDesign design;
			try {
				design = JRXmlLoader.load(jasperStream);

				JasperReport report = JasperCompileManager.compileReport(design);

				Map<String, Object> parameterMap = new HashMap<String, Object>();
//				parameterMap.put("title", title);
//				parameterMap.put("demandeur", demandeur);
				
				parameterMap.put("title", titleNew);
				parameterMap.put("demandeur", demandeurNew);

				List<Acheteur> categories = acheteurRepository.findAll();
				JRDataSource jrDataSource = new JRBeanCollectionDataSource(categories);

				JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameterMap, jrDataSource);
				final OutputStream outputStream = response.getOutputStream();

				response.setContentType("application/x-xlsx");
				response.setHeader("Content-Disposition",
						"inline; filename=" + ParamConst.FILENAME_REPORT_ACHETEUR_EXCEL + ParamConst.EXTENSION_EXCEL);

				JRXlsxExporter exporterXLS = new JRXlsxExporter();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
				exporterXLS.setParameter(JRExporterParameter.OUTPUT_STREAM, outputStream);

				exporterXLS.exportReport();

			} catch (JRException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
