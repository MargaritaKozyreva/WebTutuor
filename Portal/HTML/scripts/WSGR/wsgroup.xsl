<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" omit-xml-declaration="yes"/>

	<xsl:key name="key.1" match="row" use="cell[1]"/>

	<xsl:template match="/">
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="rows">
		<rows>
			<table border="1">
				<xsl:for-each select="row[count(. | key( 'key.1', cell[1])[1]) = 1]">
					<xsl:sort select="cell[1]" data-type="number"/>
					<tr>
						<td><b><xsl:value-of select="cell[1]/text()"/></b></td>
						<td><xsl:if test="../head/column[2]/@group='count'"><xsl:value-of select="count(key( 'key.1', cell[1])/cell[2])"/></xsl:if></td>
						<td><xsl:if test="../head/column[2]/@group='count'"><xsl:value-of select="count(key( 'key.1', cell[1])/cell[2])"/></xsl:if></td>
						<td><xsl:value-of select="sum(key( 'key.1', cell[1])/cell[4])"/></td>
						<td colspan="4">
							---
						</td>
					</tr>
					<xsl:for-each select="key( 'key.1', cell[1])">
					<tr>
						<xsl:for-each select="cell">
						<td>
							<xsl:if test="position()!=1">
								<xsl:value-of select="text()"/>
							</xsl:if>
						</td>
						</xsl:for-each>
					</tr>
					</xsl:for-each>
				</xsl:for-each>
			</table>
		</rows>
	</xsl:template>

</xsl:stylesheet>
