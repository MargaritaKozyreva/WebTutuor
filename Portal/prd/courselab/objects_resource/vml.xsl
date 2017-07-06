<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:v="urn:schemas-microsoft-com:vml"
	version="1.0">
	<xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"  />

	<xsl:template match="object">
		<xsl:variable name="vml.width">
			<xsl:choose>
				<xsl:when test="boolean(@lineWidth)=true()"><xsl:value-of select="number(@width)"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="@width"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="vml.height">
			<xsl:choose>
				<xsl:when test="boolean(@lineWidth)=true()"><xsl:value-of select="number(@height)"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="@height"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="shape/@type='line'">
				<v:line>
					<xsl:attribute name="from"><xsl:value-of select="@left"/>,<xsl:value-of select="@top"/></xsl:attribute>
					<xsl:attribute name="to"><xsl:value-of select="number(@left)+number(@width)"/>,<xsl:value-of select="number(@top)+number(@height)"/></xsl:attribute>
					<xsl:attribute name="type"><xsl:value-of select="shape/@type"/></xsl:attribute>
					<xsl:attribute name="guid"><xsl:value-of select="@guid"/></xsl:attribute>
					<xsl:attribute name="display"><xsl:value-of select="@display"/></xsl:attribute>
					<xsl:attribute name="begin"><xsl:value-of select="@begin"/></xsl:attribute>
					<xsl:attribute name="x0"><xsl:value-of select="@left"/></xsl:attribute>
					<xsl:attribute name="y0"><xsl:value-of select="@top"/></xsl:attribute>
					<xsl:attribute name="dx">0</xsl:attribute>
					<xsl:attribute name="dy">0</xsl:attribute>

					<xsl:attribute name="coordsize"><xsl:value-of select="shape/@coordsize"/></xsl:attribute>

					<v:stroke joinstyle="miter">
						<xsl:attribute name="color"><xsl:value-of select="@lineColor"/></xsl:attribute>
						<xsl:attribute name="weight">
							<xsl:choose>
								<xsl:when test="boolean(@lineWidth)=true()"><xsl:value-of select="@lineWidth"/></xsl:when>
								<xsl:otherwise>1</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<xsl:if test="@startarrow='1'"><xsl:attribute name="startarrow">block</xsl:attribute></xsl:if>
						<xsl:if test="@endarrow='1'"><xsl:attribute name="endarrow">block</xsl:attribute></xsl:if>
					</v:stroke>
				</v:line>
			</xsl:when>
			<xsl:otherwise>
				<v:shape>
					<xsl:attribute name="id"><xsl:value-of select="@id"/>~~~SHAPE</xsl:attribute>
					<xsl:attribute name="type"><xsl:value-of select="shape/@type"/></xsl:attribute>
					<xsl:attribute name="guid"><xsl:value-of select="@guid"/></xsl:attribute>
					<xsl:attribute name="display"><xsl:value-of select="@display"/></xsl:attribute>
					<xsl:attribute name="begin"><xsl:value-of select="@begin"/></xsl:attribute>
					<xsl:attribute name="x0"><xsl:value-of select="@left"/></xsl:attribute>
					<xsl:attribute name="y0"><xsl:value-of select="@top"/></xsl:attribute>
					<xsl:attribute name="dx">0</xsl:attribute>
					<xsl:attribute name="dy">0</xsl:attribute>
					<xsl:attribute name="style">
						<xsl:if test="boolean(events/onclick)=true()">cursor: pointer;</xsl:if>
						position: absolute; top: 0px; left: 0px; width: <xsl:value-of select="$vml.width"/>px; height: <xsl:value-of select="$vml.height"/>px;
					</xsl:attribute>
					<xsl:attribute name="coordsize">21600,21600</xsl:attribute>
					<xsl:attribute name="stroked">
						<xsl:choose>
							<xsl:when test="boolean(@lineColor)=true()">t</xsl:when>
							<xsl:otherwise>f</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
					<xsl:attribute name="filled">
						<xsl:choose>
							<xsl:when test="boolean(@fillColor)=true()">t</xsl:when>
							<xsl:otherwise>f</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
					<xsl:if test="boolean(shape/@adj)=true()"><xsl:attribute name="adj"><xsl:value-of select="shape/@adj"/></xsl:attribute></xsl:if>
					<xsl:if test="boolean(shape/@path)=true()"><xsl:attribute name="path"><xsl:value-of select="shape/@path"/></xsl:attribute></xsl:if>
					<xsl:if test="boolean(@fillColor)=true()">
						<v:fill>
							<xsl:if test="boolean(@alpha)=true()">
								<xsl:attribute name="opacity"><xsl:value-of select="@alpha"/></xsl:attribute>
							</xsl:if>
							<xsl:attribute name="color"><xsl:value-of select="@fillColor"/></xsl:attribute>
						</v:fill>
					</xsl:if>
					<xsl:if test="boolean(@lineColor)=true()">
						<v:stroke joinstyle="miter">
							<xsl:if test="boolean(@alpha)=true()">
								<xsl:attribute name="opacity"><xsl:value-of select="@alpha"/></xsl:attribute>
							</xsl:if>
							<xsl:attribute name="color"><xsl:value-of select="@lineColor"/></xsl:attribute>
							<xsl:attribute name="weight">
								<xsl:choose>
									<xsl:when test="boolean(@lineWidth)=true()"><xsl:value-of select="@lineWidth"/></xsl:when>
									<xsl:otherwise>1</xsl:otherwise>
								</xsl:choose>
							</xsl:attribute>
						</v:stroke>
					</xsl:if>
					<xsl:if test="boolean(shape/formulas)=true()">
						<v:formulas>
							<xsl:for-each select="shape/formulas/f">
								<v:f><xsl:attribute name="eqn"><xsl:value-of select="@eqn"/></xsl:attribute></v:f>
							</xsl:for-each>
						</v:formulas>
					</xsl:if>
					<xsl:if test="boolean(shape/path)=true()">
						<v:path>
							<xsl:if test="boolean(shape/path/@textboxrect)=true()"><xsl:attribute name="textboxrect"><xsl:value-of select="shape/path/@textboxrect"/></xsl:attribute></xsl:if>
						</v:path>
					</xsl:if>
					<xsl:if test="boolean(shape/handles)=true()">
						<v:handles>
							<xsl:for-each select="shape/handles/h">
								<v:h>
									<xsl:if test="boolean(@position)=true()"><xsl:attribute name="position"><xsl:value-of select="@position"/></xsl:attribute></xsl:if>
									<xsl:if test="boolean(@xrange)=true()"><xsl:attribute name="xrange"><xsl:value-of select="@xrange"/></xsl:attribute></xsl:if>
									<xsl:if test="boolean(@yrange)=true()"><xsl:attribute name="yrange"><xsl:value-of select="@yrange"/></xsl:attribute></xsl:if>
									<xsl:if test="boolean(@switch)=true()"><xsl:attribute name="switch"><xsl:value-of select="@switch"/></xsl:attribute></xsl:if>
								</v:h>
							</xsl:for-each>
						</v:handles>
					</xsl:if>
				</v:shape>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
