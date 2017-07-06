<?xml version="1.0" encoding="windows-1251"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" omit-xml-declaration="yes"/>

	<xsl:param name="agg.column"/>
	<xsl:param name="sort.order"/>

	<xsl:key name="key.1" match="row" use="columns/column[1]"/>
	<xsl:key name="key.2" match="row" use="columns/column[2]"/>
	<xsl:key name="key.3" match="row" use="columns/column[3]"/>
	<xsl:key name="key.4" match="row" use="columns/column[4]"/>
	<xsl:key name="key.5" match="row" use="columns/column[5]"/>
	<xsl:key name="key.6" match="row" use="columns/column[6]"/>
	<xsl:key name="key.7" match="row" use="columns/column[7]"/>
	<xsl:key name="key.8" match="row" use="columns/column[8]"/>
	<xsl:key name="key.9" match="row" use="columns/column[9]"/>
	<xsl:key name="key.10" match="row" use="columns/column[10]"/>
	<xsl:key name="key.11" match="row" use="columns/column[11]"/>
	<xsl:key name="key.12" match="row" use="columns/column[12]"/>
	<xsl:key name="key.13" match="row" use="columns/column[13]"/>
	<xsl:key name="key.14" match="row" use="columns/column[14]"/>
	<xsl:key name="key.15" match="row" use="columns/column[15]"/>
	<xsl:key name="key.16" match="row" use="columns/column[16]"/>
	<xsl:key name="key.17" match="row" use="columns/column[17]"/>
	<xsl:key name="key.18" match="row" use="columns/column[18]"/>
	<xsl:key name="key.19" match="row" use="columns/column[19]"/>
	<xsl:key name="key.20" match="row" use="columns/column[20]"/>
	<xsl:key name="key.21" match="row" use="columns/column[21]"/>
	<xsl:key name="key.22" match="row" use="columns/column[22]"/>
	<xsl:key name="key.23" match="row" use="columns/column[23]"/>
	<xsl:key name="key.24" match="row" use="columns/column[24]"/>
	<xsl:key name="key.25" match="row" use="columns/column[25]"/>
	<xsl:key name="key.26" match="row" use="columns/column[26]"/>
	<xsl:key name="key.27" match="row" use="columns/column[27]"/>
	<xsl:key name="key.28" match="row" use="columns/column[28]"/>
	<xsl:key name="key.29" match="row" use="columns/column[29]"/>
	<xsl:key name="key.30" match="row" use="columns/column[30]"/>

	<xsl:template match="/">
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="report_result">

		<xsl:variable name="current.key">key.<xsl:value-of select="$agg.column"/></xsl:variable>
		<xsl:variable name="current.sort.type"><xsl:value-of select="../header/columns/column[$agg.column]/sort/text()"/></xsl:variable>

		<xsl:choose>
			<xsl:when test="$current.sort.type='date'">

				<xsl:for-each select="rows/row[count(. | key( $current.key, columns/column[number($agg.column)])[1]) = 1]">
					<xsl:sort select="number(concat(substring-after(substring-after(columns/column[number($agg.column)]/column_value/text(),'.'),'.') , substring-before(substring-after(columns/column[number($agg.column)]/column_value/text(),'.'),'.') , substring-before(columns/column[number($agg.column)]/column_value/text(),'.')))" data-type="number" order="ascending"/>
					<xsl:if test="position()!=1">~~~</xsl:if><xsl:value-of select="columns/column[number($agg.column)]/column_value/text()"/>
				</xsl:for-each>

			</xsl:when>
			<xsl:otherwise>

				<xsl:for-each select="rows/row[count(. | key( $current.key, columns/column[number($agg.column)])[1]) = 1]">
					<xsl:sort select="columns/column[number($agg.column)]/column_value/text()" data-type="{$current.sort.type}" order="{$sort.order}"/>
					<xsl:if test="position()!=1">~~~</xsl:if><xsl:value-of select="columns/column[number($agg.column)]/column_value/text()"/>
				</xsl:for-each>

			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>

</xsl:stylesheet>
